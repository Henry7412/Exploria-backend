import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Packages } from '@/Shared/Domain/Schemas/Packages.schema';
import { BaseRepository } from '@/Shared/Infrastructure/Repositories/Base.repository';

export class PackagesRepository extends BaseRepository<Packages> {
  constructor(
    @InjectModel('Packages') private readonly packagesModel: Model<Packages>,
  ) {
    super(packagesModel);
  }

  async findPackages(filter: FilterQuery<Packages>): Promise<Packages[]> {
    return this.packagesModel.find(filter);
  }

  async findPackagesPaged(
    filter: FilterQuery<Packages>,
    skip: number,
    limit: number,
  ): Promise<Packages[]> {
    return this.packagesModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async countPackages(filter: FilterQuery<Packages>): Promise<number> {
    return this.packagesModel.countDocuments(filter);
  }

  async findById(id: Types.ObjectId): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.packagesModel
      .findOne({ _id: id, active: true })
      .select('_id name credits amount coin disable')
      .lean();
  }

  async findOneAndUpdate(filter: object, update: object): Promise<any> {
    return this.packagesModel
      .findOneAndUpdate(filter, update, { new: true })
      .exec();
  }
}
