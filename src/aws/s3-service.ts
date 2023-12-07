import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { getRequiredEnv } from '../utils';


/**
 * A service for interacting with AWS S3.
 *
 * @class
 * @constructor
 */
@Injectable()
export class S3Service {

  /** Inject the class */
  private s3: S3 = new S3({
    accessKeyId    : getRequiredEnv('AWS_ACCESS_KEY'),
    secretAccessKey: getRequiredEnv('AWS_SECRET_KEY'),
    region         : 'eu-central-1'
  });


  /**
   * Uploads a file to AWS S3.
   *
   * @async
   * @param {any} file - The file to upload.
   * @param {string} company - The company to which the file belongs.
   * @return {Promise} - A Promise that resolves to the uploaded file object, or rejects with an error.
   */
  async uploadFile(file: any, company: string) {

    return await this.s3.upload({
      Bucket     : getRequiredEnv('AWS_BUCKET_NAME'),
      Key        : `${company}/exercises/${file.originalname}.png`,
      Body       : file.buffer,
      ContentType: 'image/png'
    }).promise();
  }


}
