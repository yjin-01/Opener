import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile({
    file, //
    category,
  }): Promise<string> {
    try {
      const uniqueId = uuidv4().slice(0, 16);
      const s3 = new AWS.S3({
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
        region: this.configService.get('AWS_S3_REGION'),
      });

      const params = {
        Bucket: 'nest-app-file-upload',
        Key: `${category}/${uniqueId}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const response = await s3.upload({ ...params }).promise();
      return response.Location;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
