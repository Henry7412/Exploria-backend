import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Packages } from '@/Shared/Domain/Schemas/Packages.schema';
import { BaseRepository } from '@/Shared/Infrastructure/Repositories/Base.repository';

export class PackageRepository extends BaseRepository<Packages> {
  constructor(
    @InjectModel('Packages') private readonly packagesModel: Model<Packages>,
  ) {
    super(packagesModel);
  }

  async findAllPackages() {
    return this.packagesModel
      .find({ active: true })
      .select('-__v -active -updatedAt -deletedAt -createdAt')
      .lean();
  }
}
