import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { Logger } from '@/Shared/Infrastructure/Logger/Logger';
import {
  generateUniqueName,
  isImage,
  pathS3,
} from '@/Shared/Infrastructure/Upload/CommonImage.upload';

export const imageChatbotUpload = async (
  file: any,
  userId: Types.ObjectId,
  chatId?: Types.ObjectId,
): Promise<any> => {
  try {
    const ok = validateImage(file);
    if (!ok) return null;

    const s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET,
      },
    });

    const uniqueName = generateUniqueName(file);

    const userIdStr = userId.toString();
    const chatIdStr = chatId?.toString();

    const key = chatIdStr
      ? `chatbot/${userIdStr}/${chatIdStr}/images/${uniqueName}`
      : `chatbot/${userIdStr}/images/${uniqueName}`;

    const objectParams = {
      Bucket: process.env.AWS_S3_RESOURCE_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // CacheControl: 'public, max-age=31536000', // opcional
    };

    await s3Client.send(new PutObjectCommand(objectParams));

    return {
      fullUrl: pathS3(objectParams.Key),
      key: objectParams.Key,
      mimeType: file.mimetype,
      size: file.size,
    };
  } catch (error: any) {
    new Logger().errorMessage(
      'Error uploading chatbot image to S3',
      error?.message,
    );
    throw new NotFoundException('Error uploading image to S3');
  }
};

function validateImage(file: any): boolean {
  if (!file?.mimetype || !file?.size || !file?.buffer) return false;
  return isImage(file.mimetype) && file.size <= 5 * 1024 * 1024;
}
