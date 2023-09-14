import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from 'src/dynamic-modules/cloudinary';
import { IdeasModule } from '../ideas';
import { RatingModule } from '../rating';

@Global()
@Module({
  imports: [
    CloudinaryModule.register({
      moduleFolder: 'users',
    }),
    IdeasModule,
    RatingModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
