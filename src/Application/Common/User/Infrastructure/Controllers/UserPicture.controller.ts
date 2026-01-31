import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { UserPictureDto } from '@/Application/Common/User/Infrastructure/Dto/UserPicture.dto';
import { GetUserPictureInterface } from '@/Application/Common/User/Infrastructure/Interfaces/GetUserPicture.interface';
import { UserPictureUseCase } from '@/Application/Common/User/Appication/Post/UserPicture.useCase';
import { TransformBodyImageFileInterceptor } from '@/Shared/Infrastructure/Interceptor/TransformBodyImageFileInterceptor';

@Controller('user')
export class UserPictureController {
  constructor(
    private readonly userPictureUseCase: UserPictureUseCase,
    private readonly i18n: I18nService,
  ) {}

  @Post('picture')
  @UseInterceptors(new TransformBodyImageFileInterceptor(UserPictureDto))
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() getUserPictureInterface: GetUserPictureInterface,
  ): Promise<any> {
    const response = await this.userPictureUseCase.__invoke(
      authDto,
      getUserPictureInterface,
    );
    return successResponse(this.i18n, 'message.updated', response);
  }
}
