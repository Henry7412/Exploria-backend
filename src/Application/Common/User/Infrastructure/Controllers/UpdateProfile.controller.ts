import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { GetAuth } from '@/Shared/Infrastructure/Decorator/Auth.decorator';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { UpdateProfileDto } from '@/Application/Common/User/Infrastructure/Dto/UpdateProfile.dto';
import { successResponse } from '@/Shared/Infrastructure/Response/Response.json';
import { I18nService } from 'nestjs-i18n';
import { UpdateProfileUseCase } from '@/Application/Common/User/Appication/Put/UpdateProfile.useCase';
import { JwtAuthGuard } from '@/Shared/Infrastructure/Jwt/Guards/JwtAuth.guard';

@Controller('user-profile')
export class UpdateProfileController {
  constructor(
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly i18n: I18nService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async __invoke(
    @GetAuth() authDto: AuthDto,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    await this.updateProfileUseCase.__invoke(authDto, updateProfileDto);

    return successResponse(this.i18n, 'message.updated');
  }
}
