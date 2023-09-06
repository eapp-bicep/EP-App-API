import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { PrismaService } from 'src/global/prisma';
import { AuthResponse, Tokens } from './types';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { MyArgonOptions } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from 'src/features/user';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async signUp(authDto: SignUpAuthDto): Promise<AuthResponse> {
    const passwordHash = await this.hashData(authDto.password);
    const onboardingStep = await this.userService.getOnboardingStep(
      'SignUp',
      authDto.role,
    );
    const user = await this.prisma.user.create({
      data: {
        username: authDto.username,
        passwordHash,
        onboardingStep: {
          connect: onboardingStep,
        },
        role: { connect: { role: authDto.role } },
      },
    });

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRtHash(user.id, tokens.refreshToken);
    const nextOnboardingStep = await this.userService.getOnboardingStep(
      'EmailVerification',
      authDto.role,
    );
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshTokenHash: __,
      ...filteredUser
    } = await this.prisma.user.update({
      where: { id: user.id },
      data: { onboardingStep: { connect: nextOnboardingStep } },
      include: { onboardingStep: { include: { role: true } } },
    });
    return {
      ...filteredUser,
      ...tokens,
      // currentOnboardingStep: filteredUser.onboardingStep.stepName,
    };
  }

  async login(loginDto: LoginAuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });
    if (!user) throw new ForbiddenException('Check your credentials.');

    const passwordMatch = await this.verifyHash(
      user.passwordHash,
      loginDto.password ?? '',
    );
    if (!passwordMatch) throw new ForbiddenException('Check your credentials.');
    const tokens = await this.getTokens(user.id, user.username);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshTokenHash: __,
      ...filteredUser
    } = await this.updateRtHash(user.id, tokens.refreshToken);
    return { ...filteredUser, ...tokens };
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
        fcmToken: null,
      },
    });
    return { message: 'Logged out successfully.' };
  }

  async refreshTokenGeneration(
    userId: string,
    refreshToken: string,
  ): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access denied');

    const tokenMatches = this.verifyHash(user.refreshTokenHash, refreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access denied.');

    const tokens = await this.getTokens(user.id, user.username);
    return tokens;
  }

  private async updateRtHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
      include: { onboardingStep: { include: { role: true } } },
    });
    return user;
  }

  private hashData(data: string) {
    const opts = this.config.get<MyArgonOptions>('argon');
    return argon.hash(data, { ...opts?.argon });
  }

  private verifyHash(hash: string, data: string) {
    const opts = this.config.get<MyArgonOptions>('argon');
    return argon.verify(hash, data, { ...opts?.argon });
  }

  private async getTokens(userId: string, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { id: userId, username },
        {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
          expiresIn: '1 day', //15 min
        },
      ),
      this.jwt.signAsync(
        { id: userId, username },
        {
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '7 days', //1 week
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
