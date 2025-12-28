import { Module } from '@nestjs/common';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { UserSchema } from '@/Shared/Domain/Schemas/User.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateProfileController } from '@/Application/Common/User/Infrastructure/Controllers/UpdateProfile.controller';
import { UserService } from '@/Application/Common/User/Infrastructure/Services/User.service';
import { UpdateProfileUseCase } from '@/Application/Common/User/Appication/Put/UpdateProfile.useCase';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])],
  controllers: [UpdateProfileController],
  providers: [UserRepository, UserService, UpdateProfileUseCase],
  exports: [UserRepository],
})
export class UserModule {}
