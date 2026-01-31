import { Module } from '@nestjs/common';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateProfileController } from '@/Application/Common/User/Infrastructure/Controllers/UpdateProfile.controller';
import { UserService } from '@/Application/Common/User/Infrastructure/Services/User.service';
import { UpdateProfileUseCase } from '@/Application/Common/User/Appication/Put/UpdateProfile.useCase';
import { UserPictureController } from '@/Application/Common/User/Infrastructure/Controllers/UserPicture.controller';
import { UserPictureUseCase } from '@/Application/Common/User/Appication/Post/UserPicture.useCase';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])],
  controllers: [UpdateProfileController, UserPictureController],
  providers: [
    UserRepository,
    UserService,
    UpdateProfileUseCase,
    UserPictureUseCase,
  ],
  exports: [UserRepository],
})
export class UserModule {}
