import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SaveUserProfileDto } from './dto/save-user-profile.dto';
import { GetCurrentUser } from 'src/shared/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/my')
  getUser(@GetCurrentUser('id') userId: string) {
    return this.userService.getUserData(userId);
  }
  @Get('/my/profile')
  getUserProfile(@GetCurrentUser('id') userId: string) {
    return this.userService.getUserPersonalProfile(userId);
  }

  @Get('/mentors')
  getMentorList() {
    return this.userService.getMentorsList();
  }

  @Delete()
  deleteUser(@GetCurrentUser('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  create(
    @GetCurrentUser('id') userId: string,
    @Body() saveUserProfileDto: SaveUserProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.saveUserProfile(userId, saveUserProfileDto, file);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
