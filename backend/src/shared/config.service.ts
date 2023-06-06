import { Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv'
import { AwsConfig } from "./dto/aws.dto";

@Injectable()
export class ConfigService{
    private readonly env: { [x: string]: string; }
    constructor(){
        const dotEnv = dotenv.config({ path: './.env'}).parsed
        const exampleEnv = dotenv.config({path: './.env.example'}).parsed
        this.env = { ...exampleEnv, ...dotEnv }
    }

    get(variable: string){
        const value = this.env[variable];
        if(value){
            return value
        } else {
            throw Error(`${variable} was not found in .env file!`)
        }
    }

    getAwsConfig(): AwsConfig{
        const env = this.get('ENV')
        if(env === 'dev'){
            return {
                awsAccessKeyId: this.get('AWS_ACCESS_KEY_ID'),
                awsSecretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
                endpoint: this.get('AWS_ENDPOINT_LOCAL')
            }
        } else {
            return {
                awsAccessKeyId: this.get('AWS_ACCESS_KEY_ID'),
                awsSecretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
                endpoint: this.get('AWS_ENDPOINT')
            }
        }
    }
    
}