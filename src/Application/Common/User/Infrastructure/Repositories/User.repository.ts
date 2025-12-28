import { BaseRepository } from '@/Shared/Infrastructure/Repositories/Base.repository';
import { User, UserDocument } from '@/Shared/Domain/Schemas/User.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {
    super(userModel);
  }

  async create(userData: Partial<UserDocument>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async existsByEmailOrPhone(emailOrPhone: string): Promise<boolean> {
    const filter: FilterQuery<UserDocument> = emailOrPhone.includes('@')
      ? { email: emailOrPhone }
      : { phoneNumber: emailOrPhone };
    const user = await this.userModel.findOne(filter).exec();
    return !!user;
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
        active: true,
      })
      .exec();
  }

  async assignSubscriptionAndPlanToUser(
    userId: Types.ObjectId,
    subscriptionId: Types.ObjectId,
    planId: Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          subscriptionId,
          plan: planId,
        },
        { new: true },
      )
      .exec();
  }
}
