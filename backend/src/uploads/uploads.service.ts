import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  // Implement S3/MinIO signed URL logic here
  getSignedUploadUrl() {
    return { todo: true };
  }
}
