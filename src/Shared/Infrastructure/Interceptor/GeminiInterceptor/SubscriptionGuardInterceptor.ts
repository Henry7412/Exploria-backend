import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Observable, of } from 'rxjs';

import { CreditsDocument } from '@/Shared/Domain/Schemas/Credits.schema';
import { UserDocument } from '@/Shared/Domain/Schemas/User.schema';
import { ChatBotRepository } from '@/Application/Landing/ChatBot/Infrastructure/Repositories/ChatBot.respository';
import { SystemMessageEnum } from '@/Shared/Infrastructure/Common/Enum/SystemMessage.enum';

@Injectable()
export class SubscriptionGuardInterceptor implements NestInterceptor {
  constructor(
    private readonly chatBotRepository: ChatBotRepository,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Credits')
    private readonly creditsModel: Model<CreditsDocument>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: any = context.switchToHttp().getRequest();
    const chatId: any = req.params.chatId;
    const authDto = req.user || null;

    if (!authDto) {
      const userMessageCount = await this.chatBotRepository.countUserMessages(
        new Types.ObjectId(chatId),
      );
      if (userMessageCount >= 3) {
        const message = await this.chatBotRepository.saveMessage({
          chatId: new Types.ObjectId(chatId),
          role: 'system',
          value: SystemMessageEnum.FREE_QUESTIONS_EXCEEDED.toString(),
          createdAt: new Date(),
        });

        return of({
          _id: (message as any)._id,
          role: message.role,
          value: message.value,
          createdAt: message.createdAt,
        });
      }
      return next.handle();
    }

    const user = await this.userModel.findById(authDto._id).lean();

    if (!user) {
      const message = await this.chatBotRepository.saveMessage({
        chatId: new Types.ObjectId(chatId),
        role: 'system',
        value: SystemMessageEnum.USER_NOT_REGISTERED.toString(),
        createdAt: new Date(),
      });

      return of({
        _id: (message as any)._id,
        role: message.role,
        value: message.value,
        createdAt: message.createdAt,
      });
    }

    const creditsAgg = await this.creditsModel.aggregate([
      {
        $match: {
          userId: user._id,
          active: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);
    const credits = creditsAgg[0]?.total ?? 0;

    if (credits <= 0) {
      const message = await this.chatBotRepository.saveMessage({
        chatId: new Types.ObjectId(chatId),
        role: 'system',
        value: SystemMessageEnum.CREDITS_SOLD_OUT.toString(),
        createdAt: new Date(),
      });

      return of({
        _id: (message as any)._id,
        role: message.role,
        value: message.value,
        createdAt: message.createdAt,
      });
    }

    return next.handle();
  }
}
