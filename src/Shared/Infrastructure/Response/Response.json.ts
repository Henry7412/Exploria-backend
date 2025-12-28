import { I18nService } from 'nestjs-i18n';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';

export const successResponse = (
  i18n: I18nService,
  messageKey: string | null = null,
  document: unknown = null,
  code?: string,
) => {
  const message = messageKey ? messageI18n(i18n, messageKey) : null;

  return {
    ...(message && { message }),
    ...(document && { data: document }),
    code,
  };
};
