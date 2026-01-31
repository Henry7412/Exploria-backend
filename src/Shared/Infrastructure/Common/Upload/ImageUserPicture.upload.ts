import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { Logger } from '@/Shared/Infrastructure/Logger/Logger';
import {
  generateUniqueName,
  isImage,
  pathS3,
} from '@/Shared/Infrastructure/Upload/CommonImage.upload';

export const imageUserPictureUpload = async (
  file: any,
  userId: Types.ObjectId,
): Promise<any> => {
  try {
    const next = validateAndRetrieveImage(file);

    if (next) {
      const s3Client = new S3Client({
        region: process.env.AWS_S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_S3_KEY,
          secretAccessKey: process.env.AWS_S3_SECRET,
        },
      });

      const uniquePath = generateUniqueName(file);
      const path = `user/${userId.toString()}/picture/${uniquePath}`;

      const objectParams = {
        Bucket: process.env.AWS_S3_RESOURCE_BUCKET,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(objectParams);
      await s3Client.send(command);

      return {
        fullPathPicture: pathS3(objectParams.Key),
        pathPicture: objectParams.Key,
      };
    }

    return null;
  } catch (error) {
    new Logger().errorMessage('Error uploading image to S3', error.message);
    throw new NotFoundException('Error uploading image to S3');
  }
};

function validateAndRetrieveImage(file: any): boolean {
  return isImage(file.mimetype) && file.size <= 5 * 1024 * 1024;
}
