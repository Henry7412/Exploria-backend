import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '@/Shared/Domain/Schemas/User.schema';
import { ChatDocument } from '@/Shared/Domain/Schemas/Chat.schema';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';
import { UserProfile } from '@/Shared/Infrastructure/Common/Gemini/Type/UserProfile';
import { MessageDocument } from '@/Shared/Domain/Schemas/Message.schema';
import { PromptHistoryDocument } from '@/Shared/Domain/Schemas/PromptHistory.schema';
import { VoiceToneEnum } from '@/Shared/Infrastructure/Common/Enum/VoiceTone.enum';
import { ProfessionalViewEnum } from '@/Shared/Infrastructure/Common/Enum/ProfessionalView.enum';

@Injectable()
export class ChatBotRepository {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatDocument>,
    @InjectModel('Messages')
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel('Users') private readonly userModel: Model<UserDocument>,
    @InjectModel('PromptHistory')
    private readonly promptHistoryModel: Model<PromptHistoryDocument>,
  ) {}

  async findChat(params: {
    userId?: string | null;
    deviceId: string;
  }): Promise<ChatDocument | null> {
    const filter: any = {
      deviceId: params.deviceId,
    };

    if (params.userId) {
      filter['createdBy._id'] = params.userId;
    } else {
      filter['createdBy._id'] = null;
    }

    return this.chatModel.findOne(filter).sort({ createdAt: -1 }).exec();
  }

  async createChat(
    authDto: AuthDto | null,
    storeChatDto: StoreChatDto,
  ): Promise<ChatDocument> {
    const createdBy = authDto
      ? {
          _id: authDto._id,
          names: authDto.names ?? 'Anonymous',
          lastNames: authDto.lastNames ?? '',
          picture: authDto.picturePath ?? null,
        }
      : {
          _id: null,
          names: 'Anonymous',
          lastNames: '',
          picture: null,
        };

    const chat = new this.chatModel({
      createdBy,
      deviceId: storeChatDto.deviceId,
      createdAt: new Date(),
      user: false,
    });

    return chat.save();
  }

  async findUserProfileById(
    userId: Types.ObjectId | string,
  ): Promise<UserProfile> {
    const user = await this.userModel
      .findById(userId)
      .populate('nationality', 'name')
      .lean();

    if (!user) return null;
    const age =
      user.dateOfBirth && typeof user.dateOfBirth === 'string'
        ? this.calculateAge(user.dateOfBirth)
        : null;

    return {
      name: `${user.names ?? ''}`.trim(),
      jobTitle: user.jobTitle ?? '',
      interest: Array.isArray(user.interest) ? user.interest : [],
      hobbies: user.hobbies ?? '',
      languages:
        Array.isArray(user.languages) && user.languages.length > 0
          ? user.languages
          : ['ES'],
      aboutMe: user.aboutMe ?? '',
      age,
      nationality:
        typeof user.nationality === 'object' &&
        user.nationality !== null &&
        'name' in user.nationality
          ? (user.nationality as any).name
          : 'Perú',
      favoriteFoods: user.favoriteFoods ?? '',
      medicalConsiderations: user.medicalConsiderations ?? '',
      funFact: user.funFact ?? '',
      perspectives: user.perspectives ?? [],
      voiceTones: user.voiceTones ?? [],
    };
  }

  public calculateAge(dateOfBirth: string): number | null {
    if (!dateOfBirth) return null;
    const [day, month, year] = dateOfBirth.split('-').map(Number);
    if (!day || !month || !year) return null;
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async findChatById(chatId: Types.ObjectId) {
    return this.chatModel.findById(chatId).exec();
  }

  async saveMessage(message: {
    chatId: Types.ObjectId;
    role: 'user' | 'model' | 'system';
    value: any;
    model?: string;
    toxicity?: number;
    createdBy?: {
      _id: Types.ObjectId;
      names: string;
      lastNames: string;
      picture: string;
    };
    deviceId?: string;
    createdAt?: Date;
  }): Promise<MessageDocument> {
    return this.messageModel.create(message);
  }

  async findChatBot(params: {
    current?: boolean;
    deviceId: string;
  }): Promise<ChatDocument | null> {
    const filter: any = { deviceId: params.deviceId };

    if (typeof params.current === 'boolean') {
      filter.current = params.current;
    } else {
      filter.current = true;
    }

    return this.chatModel.findOne(filter).exec();
  }

  async setCurrentFalse(chatId: Types.ObjectId): Promise<void> {
    await this.chatModel.updateOne(
      { _id: chatId },
      { $set: { current: false } },
    );
  }

  async createChatWithCurrent(
    authDto: AuthDto | null,
    storeChatDto: StoreChatDto,
    current: boolean,
  ): Promise<ChatDocument> {
    const createdBy = authDto
      ? {
          _id: authDto._id,
          names: authDto.names ?? 'Anonymous',
          lastNames: authDto.lastNames ?? '',
          picture: authDto.picturePath ?? null,
        }
      : {
          _id: null,
          names: 'Anonymous',
          lastNames: '',
          picture: null,
        };

    const chat = new this.chatModel({
      createdBy,
      deviceId: storeChatDto.deviceId,
      createdAt: new Date(),
      current,
    });

    return chat.save();
  }

  async countUserMessages(chatId: Types.ObjectId): Promise<number> {
    return this.messageModel.countDocuments({
      chatId,
      role: 'user',
    });
  }

  async getRecentMessages(
    chatId: Types.ObjectId,
    limit = 10,
  ): Promise<MessageDocument[]> {
    const items = await this.messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return items.reverse();
  }

  async getAllActivePrompts(
    types?: string[],
  ): Promise<PromptHistoryDocument[]> {
    const query: any = { active: true };

    if (Array.isArray(types) && types.length > 0) {
      query.types = { $in: types };
    }

    return this.promptHistoryModel.find(query).lean();
  }

  async updateChatName(chatId: Types.ObjectId, name: string): Promise<void> {
    await this.chatModel.updateOne({ _id: chatId }, { $set: { name } });
  }

  async findMessagesByChatIdPaginated(
    chatId: Types.ObjectId,
    page: number,
    pageSize: number,
  ): Promise<{ messages: MessageDocument[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ chatId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      this.messageModel.countDocuments({ chatId }),
    ]);
    return { messages, total };
  }

  async getChatPreferences(chatId: Types.ObjectId | string): Promise<
    Partial<UserProfile> & {
      voiceTones?: VoiceToneEnum[];
      perspectives?: ProfessionalViewEnum[];
    }
  > {
    const chat = await this.chatModel.findById(chatId).lean();
    if (!chat) return {};
    return {
      funFact: chat.funFact ?? '',
      jobTitle: chat.jobTitle ?? '',
      favoriteFoods: chat.favoriteFoods ?? '',
      voiceTones: chat.voiceTones ?? [],
      perspectives: chat.perspectives ?? [],
      medicalConsiderations: chat.medicalConsiderations ?? '',
    };
  }
}
