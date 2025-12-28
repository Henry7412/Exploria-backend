import { pathS3 } from '@/Shared/Infrastructure/Upload/CommonImage.upload';

export function showAuthUser(user: any) {
  const {
    names,
    lastNames,
    email,

    phoneNumber,
    picture,
  } = user;

  return {
    names,
    lastNames,
    email,
    phoneNumber,
    picture: pathS3(picture),
  };
}
