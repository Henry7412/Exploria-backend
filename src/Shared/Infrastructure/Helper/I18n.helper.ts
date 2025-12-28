import { I18nContext, I18nService } from 'nestjs-i18n';

export const messageI18n = (
  i18n: I18nService,
  messageKey: string,
  args: object = {},
): number => {
  return i18n.t(messageKey, {
    lang: I18nContext.current().lang,
    args: args,
  });
};
