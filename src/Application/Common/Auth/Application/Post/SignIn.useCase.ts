import { Injectable } from '@nestjs/common';
import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';
import { AuthSignInDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthSignIn.dto';

@Injectable()
export class SignInUseCase {
  constructor(private readonly authService: AuthService) {}

  async __invoke(authSignInDto: AuthSignInDto): Promise<any> {
    return await this.authService.login(authSignInDto);
  }
}
