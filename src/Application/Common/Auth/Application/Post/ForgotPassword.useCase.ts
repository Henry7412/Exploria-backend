import { Injectable } from '@nestjs/common';
import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';
import { ForgotPasswordDto } from '@/Application/Common/Auth/Infrastructure/Dto/ForgotPassword.dto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authService: AuthService) {}

  async __invoke(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }
}
