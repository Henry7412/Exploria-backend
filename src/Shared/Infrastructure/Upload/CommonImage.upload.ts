export const pathS3 = (image: string | null): string | null => {
  return image ? `${process.env.AWS_S3_URL}/${image}` : null;
};

export const strSlugHash = (inputString: string): string => {
  return inputString
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^-+|-+$/g, '');
};

export const isImage = (mimetype: string): boolean => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  return allowedImageTypes.includes(mimetype);
};

export const generateUniqueName = (file: any): string => {
  const [name, ext] = file.originalname.split(/(?=\.[^.]+$)/);
  return `${strSlugHash(name)}_${Math.random().toString(36).substring(2, 8)}${ext || ''}`;
};
