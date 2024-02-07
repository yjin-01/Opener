import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';
import { EmailSendRequest } from './swagger/email.send.request';
import { EmailExistException } from './exception/email.exist.exception';
import { EmailSendBadRequest } from './swagger/email.send.badrequest';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('이메일')
@Controller('/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({
    description: '유저에게 계정 확인을 위한 메일을 보냅니다',
  })
  @ApiBadRequestResponse({
    description:
      'request가 잘못되었을 때 반환합니다(body 또는 API 결과가 유효하지 않을 때)',
    type: EmailSendBadRequest,
  })
  @ApiOkResponse({
    description: 'API가 성공했을 경우 반환합니다',
    type: EmailSendRequest,
  })
  @ApiInternalServerErrorResponse({
    description: 'API를 성공하지 못했을 경우 반환합니다',
  })
  @Public()
  @Post()
  async sendMail(@Body() emailDto: EmailDto): Promise<number | null> {
    try {
      return await this.emailService.send(emailDto);
    } catch (error) {
      if (error instanceof EmailExistException) {
        throw new BadRequestException(error);
      }
      throw new InternalServerErrorException();
    }
  }
}
