import { Injectable } from '@nestjs/common';

import { UserService } from '@/Application/Common/User/Infrastructure/Services/User.service';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetUserPictureInterface } from '@/Application/Common/User/Infrastructure/Interfaces/GetUserPicture.interface';

@Injectable()
export class UserPictureUseCase {
  constructor(private readonly userService: UserService) {}

  async __invoke(
    authDto: AuthDto,
    getUserPictureInterface: GetUserPictureInterface,
  ): Promise<any> {
    return await this.userService.userPicture(authDto, getUserPictureInterface);
  }
}
