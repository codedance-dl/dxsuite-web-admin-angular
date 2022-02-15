
export interface CaptchaConfig {
  id: string;
  intervalMilliseconds?: number;
  intervalSeconds?: number;
  maxVerifyTimes?: number;
  rateLimitPeriod?: number;
  rateLimitPeriodMilliseconds?: number;
  rateLimitTimes?: number;
  revision?: number;
  ttl?: number;
  keyType?: string;
  purpose?: string;
  templateId?: string;
}
