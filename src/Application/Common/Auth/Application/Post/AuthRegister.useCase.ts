import { AuthRegisterDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthRegister.dto';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@/Application/Common/Auth/Infrastructure/Services/Auth.service';

@Injectable()
export class AuthRegisterUseCase {
  constructor(private readonly authService: AuthService) {}

  async __invoke(authRegisterDto: AuthRegisterDto): Promise<any> {
    return await this.authService.registerUser(authRegisterDto);
  }
}
