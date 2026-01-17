import { Injectable } from '@nestjs/common';
import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';
import { ResetPasswordDto } from '@/Application/Common/Auth/Infrastructure/Dto/ResetPassword.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async __invoke(resetPasswordDto: ResetPasswordDto): Promise<any> {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
