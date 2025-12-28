import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { AuthRegisterDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthRegister.dto';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import * as bcrypt from 'bcrypt';
import { showAuthUser } from '@/Shared/Infrastructure/Helper/Auth.helper';
import { AuthSignInDto } from '@/Application/Common/Auth/Infrastructure/Dto/AuthSignIn.dto';
import { RedisClientService } from '@/Shared/Infrastructure/Config/Redis/Service/RedisClient.service';
import { pathS3 } from '@/Shared/Infrastructure/Upload/CommonImage.upload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly redisClientService: RedisClientService,
    private readonly i18n: I18nService,
  ) {}

  async registerUser(authRegisterDto: AuthRegisterDto) {
    const { names, lastNames, emailOrPhone, password } = authRegisterDto;

    const exists = await this.userRepository.existsByEmailOrPhone(emailOrPhone);
    if (exists) {
      throw new BadRequestException(
        messageI18n(this.i18n, 'validation.user_already_exists'),
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const userData = {
      names,
      lastNames,
      email: emailOrPhone?.includes('@') ? emailOrPhone : null,
      phoneNumber: !emailOrPhone?.includes('@') ? emailOrPhone : null,
      password: hashedPassword,
      active: true,
    };

    const user = await this.userRepository.create(userData);

    return {
      _id: user._id,
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    };
  }

  async login(authSignInDto: AuthSignInDto) {
    const { emailOrPhone, password } = authSignInDto;

    const user = await this.userRepository.findByEmailOrPhone(emailOrPhone);

    if (!user) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validate.user_not_found'),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(messageI18n(this.i18n, 'auth.failed'));
    }

    const payload = {
      sub: user._id.toString(),
      emailOrPhone,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: showAuthUser(user),
    };
  }

  async setAuthUser(emailOrPhone: string): Promise<any> {
    const auth = await this.userRepository.findByEmailOrPhone(emailOrPhone);

    const userCache = await this.redisClientService.getItem(
      auth._id.toString(),
    );

    if (userCache) {
      return userCache;
    } else {
      if (!auth) {
        throw new UnauthorizedException();
      }

      await this.saveAuthUser(auth);
      return await this.redisClientService.getItem(auth._id.toString());
    }
  }

  private async saveAuthUser(user: any) {
    const {
      _id,
      names,
      lastNames,
      email,
      products,
      status,
      phoneNumber,
      picture,
    } = user;

    await this.redisClientService.createItem(_id.toString(), {
      _id,
      names,
      lastNames,
      email,
      products,
      status,
      phoneNumber,
      picture: pathS3(picture),
      picturePath: picture,
    });
  }
}
