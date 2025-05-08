import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
    async validateOtp(code: string): Promise<boolean> {
        const envCode = process.env.OTP_CODE;

        if (!envCode || !code) {
            return false;
        }

        return code === envCode.toString();
    }
}
