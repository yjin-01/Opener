import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileCategoryEnum } from './enum/file.enum';

@ApiTags('이미지')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @ApiOperation({
    summary: '이미지 등록',
    description: '이미지를 AWS S3에 등록하여 URL을 생성합니다.',
  })
  @ApiQuery({
    name: 'category',
    description: '이미지 폴더별 관리용',
    enum: FileCategoryEnum,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      description: '이미지 첨부',
      required: ['file'],
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '정상 등록된 URL 주소',
    type: String,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile()
      file: Express.Multer.File,
      @Query('category') category: FileCategoryEnum,
  ): Promise<string> {
    const imageUrl = await this.fileService.uploadFile({ file, category });

    return imageUrl;
  }
}
