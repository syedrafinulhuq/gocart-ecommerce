import { Controller, Get } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private uploads: UploadsService) {}

  @Get('signed-url')
  signedUrl() {
    return this.uploads.getSignedUploadUrl();
  }
}
