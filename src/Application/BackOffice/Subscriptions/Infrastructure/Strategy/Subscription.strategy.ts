import * as dayjs from 'dayjs';

import { BillingPeriodEnum } from '@/Shared/Infrastructure/Common/Enum/BillingPeriod.enum';

export const CREDIT_COSTS = {
  CHAT_SIMPLE: 1,
  AUDIO: 2,
  SPECIFIC_QUERY: 3,
  FILE_UPLOAD: 5,
  PERSONALIZED_RECOMMENDATIONS: 10,
};

export function calculateEndDate(
  plan: { duration: number; period: BillingPeriodEnum },
  fromDate: Date,
): Date | null {
  const duration = plan.duration;
  if (!duration) return null;

  let date = dayjs(fromDate);

  if (plan.period === BillingPeriodEnum.MONTHLY) {
    date = date.add(duration, 'month');
  } else if (plan.period === BillingPeriodEnum.WEEKLY) {
    date = date.add(duration, 'week');
  }

  return date.toDate();
}
