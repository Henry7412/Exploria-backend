// import { S3Client } from '@aws-sdk/client-s3';
//
// let _s3Client: S3Client | null = null;
//
// export function getS3Client(): S3Client {
//   if (!_s3Client) {
//     if (
//       !process.env.AWS_S3_REGION ||
//       !process.env.AWS_S3_KEY ||
//       !process.env.AWS_S3_SECRET
//     ) {
//       throw new Error('❌ AWS S3 config missing');
//     }
//     _s3Client = new S3Client({
//       region: process.env.AWS_S3_REGION,
//       credentials: {
//         accessKeyId: process.env.AWS_S3_KEY,
//         secretAccessKey: process.env.AWS_S3_SECRET,
//       },
//     });
//   }
//   return _s3Client;
// }
