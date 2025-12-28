import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { I18nService } from 'nestjs-i18n';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { UpdateProfileDto } from '@/Application/Common/User/Infrastructure/Dto/UpdateProfile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
  ) {}
  async updateProfilerUser(
    authDto: AuthDto,
    updateProfileDto: UpdateProfileDto,
  ) {
    const {
      names,
      lastNames,
      email,
      phoneNumber,
      dateOfBirth,
      picture,
      hobbies,
      jobTitle,
      interest,
      languages,
      zipCode,
      nationality,
      aboutMe,
      funFact,
      favoriteFoods,
      medicalConsiderations,
    } = updateProfileDto;

    const attributes: any = {
      names,
      lastNames,
      email,
      phoneNumber,
      dateOfBirth,
      picture,
      hobbies,
      jobTitle,
      interest,
      languages,
      zipCode,
      nationality,
      aboutMe,
      funFact,
      favoriteFoods,
      medicalConsiderations,
    };

    const userId = authDto._id;

    await this.userRepository.updateOne({ _id: userId }, { ...attributes });
  }
}
