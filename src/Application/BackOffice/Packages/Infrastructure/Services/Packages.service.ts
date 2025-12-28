import { Injectable, NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { I18nService } from 'nestjs-i18n';

import { PackageDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/Package.dto';
import { PackageDisableDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageDisable.dto';
import { PackageItemsDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackageItems.dto';
import { PackagePaginationDto } from '@/Application/BackOffice/Packages/Infrastructure/Dto/PackagePagination.dto';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import { PackagesRepository } from '@/Application/BackOffice/Packages/Infrastructure/Repositories/Packages.repository';

@Injectable()
export class PackagesService {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly i18n: I18nService,
  ) {}

  async getPackages(authDto: AuthDto): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const packages = await this.packagesRepository.findPackages({
      active: true,
      deletedAt: null,
      disable: false,
    });

    const filtered = packages.map((pkg) => ({
      _id: pkg._id,
      name: pkg.name,
      credits: pkg.credits,
      amount: pkg.amount,
      createdBy: pkg.createdBy,
    }));

    return { data: filtered };
  }

  async storePackage(
    authDto: AuthDto,
    packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    await this.packagesRepository.create({
      name: packageItemsDto.name,
      credits: packageItemsDto.credits,
      amount: packageItemsDto.amount,
      coin: packageItemsDto.coin,
      active: true,
      disable: false,
      createdAt: new Date(),
      createdBy: {
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath || '',
      },
    } as any);

    return;
  }

  async updatePackage(
    authDto: AuthDto,
    packageDto: PackageDto,
    packageItemsDto: PackageItemsDto,
  ): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const packageData = await this.packagesRepository.findById(packageDto.id);
    if (!packageData) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    const updateData: any = {
      name: packageItemsDto.name,
      credits: packageItemsDto.credits,
      amount: packageItemsDto.amount,
      coin: packageItemsDto.coin,
      updatedAt: new Date(),
      updatedBy: {
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath,
      },
    };

    await this.packagesRepository.updateOne(
      { _id: packageDto.id },
      { $set: updateData },
    );

    return;
  }

  async deletePackage(authDto: AuthDto, packageDto: PackageDto): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const foundPackage = await this.packagesRepository.findById(packageDto.id);

    if (!foundPackage) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    await this.packagesRepository.findOneAndUpdate(
      { _id: packageDto.id, active: true },
      {
        $set: {
          active: false,
          deletedAt: new Date(),
          deletedBy: {
            names: authDto.names,
            lastNames: authDto.lastNames,
            picture: authDto.picturePath,
          },
        },
      },
    );

    return;
  }

  async disablePackage(
    authDto: AuthDto,
    packageDto: PackageDto,
    packageDisableDto: PackageDisableDto,
  ): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const foundPackage = await this.packagesRepository.findById(packageDto.id);

    if (!foundPackage) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    await this.packagesRepository.updateOne(
      { _id: packageDto.id },
      {
        $set: {
          disable: packageDisableDto.disable,
          updatedAt: new Date(),
          updatedBy: {
            names: authDto.names,
            lastNames: authDto.lastNames,
            picture: authDto.picturePath,
          },
        },
      },
    );

    return;
  }

  async listPackages(
    authDto: AuthDto,
    packagePaginationDto: PackagePaginationDto,
  ): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const { page = 1, pageSize = 10 } = packagePaginationDto;
    const skip = (page - 1) * pageSize;

    const filter = { active: true };

    const [data, total] = await Promise.all([
      this.packagesRepository.findPackagesPaged(filter, skip, pageSize),
      this.packagesRepository.countPackages(filter),
    ]);

    const items = data.map((pkg) => ({
      _id: pkg._id,
      name: pkg.name,
      credits: pkg.credits,
      coin: pkg.coin,
      amount: pkg.amount,
      createdAt: pkg.createdAt,
      disable: pkg.disable,
    }));

    return {
      data: {
        items,
        pagination: {
          page,
          pageSize: pageSize,
          total,
        },
      },
    };
  }

  async packageDetail(authDto: AuthDto, packageDto: PackageDto): Promise<any> {
    if (!authDto || !authDto._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.unauthorized'),
      );
    }

    const packageFound = await this.packagesRepository.findById(packageDto.id);

    if (!packageFound) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.package_not_found'),
      );
    }

    return {
      data: packageFound,
    };
  }
}
