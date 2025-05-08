import { Module } from '@nestjs/common';
import { OtpController } from './controller/otp.controller';
import { OtpService } from './service/otp.service';

@Module({
    controllers: [OtpController],
    providers: [OtpService],
})
export class OtpModule { }
