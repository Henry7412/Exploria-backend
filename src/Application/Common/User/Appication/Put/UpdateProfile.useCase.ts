import { Injectable } from '@nestjs/common';

import { UpdateProfileDto } from '@/Application/Common/User/Infrastructure/Dto/UpdateProfile.dto';
import { UserService } from '@/Application/Common/User/Infrastructure/Services/User.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userService: UserService) {}

  async __invoke(
    authDto: AuthDto,
    updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    return await this.userService.updateProfilerUser(authDto, updateProfileDto);
  }
}
