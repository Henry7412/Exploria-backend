import { Module } from '@nestjs/common';
import { JwtModule as jwtModule } from '@nestjs/jwt';

const jwtRegister = jwtModule.registerAsync({
  imports: [],
  inject: [],
  useFactory: () => ({
    secret: process.env.HASH_JWT_AUTH,
    signOptions: { expiresIn: '24h' },
  }),
});

@Module({
  imports: [jwtRegister],
  exports: [jwtRegister],
})
export class JwtModule {}
