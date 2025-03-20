import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const headers = req.headers;

    let ip = headers['cf-connecting-ip'] || headers['x-forwarded-for'];

    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    return ip || req.clientIp;
  }
}
