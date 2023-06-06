import { Injectable } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { S3Client, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand, GetObjectCommandOutput, ListBucketsCommand  } from '@aws-sdk/client-s3'
import { Readable } from "stream";

@Injectable()
export class AwsS3Service{
    private readonly s3Client: S3Client
    readonly productPhotoBucket: string
    readonly endpoint: string

    constructor(private readonly configService: ConfigService) {
        this.productPhotoBucket = this.configService.get('RENTO_PRODUCT_PHOTO_S3_BUCKET')
        const awsConfig = this.configService.getAwsConfig()
        this.endpoint = awsConfig.endpoint
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: awsConfig.awsAccessKeyId,
                secretAccessKey: awsConfig.awsSecretAccessKey
            },
            endpoint: awsConfig.endpoint,
            // endpointProvider: (params: EndpointParameters) => ({
            //     url: new URL(awsConfig.endpoint)
            // }) 
            forcePathStyle: true,
          
        })
    }

    async putObject(putObject: PutObjectCommand): Promise<PutObjectCommandOutput>{
        try{
            const response = await this.s3Client.send(putObject)
            return response 
        }catch(err){
            throw new Error(`${err}`)
        }
    }

    async getObject(getObject: GetObjectCommand): Promise<GetObjectCommandOutput>{
        try{
            const response = await this.s3Client.send(getObject)
            return response 
        }catch(err){
            throw new Error(`${err}`)
        }
    }

    async listBuckets(){
        const command = new ListBucketsCommand({});
      
        try {
          const { Owner, Buckets } = await this.s3Client.send(command);
          console.log(
            `${Owner.DisplayName} owns ${Buckets.length} bucket${
              Buckets.length === 1 ? "" : "s"
            }:`
          );
            console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
            return Buckets
        } catch (err) {
          console.error(err);
        }
    }
    
    async savePhotosToS3FromFile({ file, key }: { file: Express.Multer.File, key: string}) {
       
            const readableStream = new Readable();
            readableStream.push(file.buffer)
            readableStream.push(null);
            const putObjectCommand = new PutObjectCommand({
                Bucket: this.productPhotoBucket,
                Key: key,
                Body: readableStream
            })
            await this.putObject(putObjectCommand)
    
    }
}