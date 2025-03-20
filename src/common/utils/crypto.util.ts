import { createHmac } from 'node:crypto';

export const encrypt = (value: string, secretKey: string): string => {
  return createHmac('sha256', secretKey).update(value).digest('hex');
};
