import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from '../service/otp.service';
import { ValidateOtpDto } from '../dto/validate-otp.dto';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) { }

    @Post('validate')
    async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
        const isValid = await this.otpService.validateOtp(validateOtpDto.code);
        return { isValid };
    }
}
