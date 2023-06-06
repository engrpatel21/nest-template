import { DataSource } from 'typeorm';
import { postgreConfig } from './tyeporm.config';
export = postgreConfig.map((config) => new DataSource(config))