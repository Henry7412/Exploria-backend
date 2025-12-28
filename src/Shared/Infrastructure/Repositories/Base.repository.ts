import { Document, Model, Types } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected constructor(private readonly model: Model<T>) {}

  async create(entity: T): Promise<T> {
    const newEntity = new this.model(entity);
    return await newEntity.save();
  }

  async find(query: any = {}, projection: any = {}): Promise<T[] | null> {
    return await this.model.find(query, projection).exec();
  }

  async findOne(attributes: any, projection: any = {}): Promise<T | null> {
    return await this.model
      .findOne(
        {
          ...attributes,
          active: true,
        },
        projection,
      )
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this.model.findById({ _id: id, active: true }).exec();
  }

  async findAll(): Promise<T[]> {
    return (await this.model.find({ active: true } as any).exec()) as T[];
  }

  async update(id: Types.ObjectId, attributes: Partial<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, attributes, { new: true })
      .exec();
  }

  async updateOne(filter: any, attributes: any): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, attributes, { new: true });
  }

  async updateById(id: Types.ObjectId, attributes: Partial<T>): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: attributes });
  }
}
