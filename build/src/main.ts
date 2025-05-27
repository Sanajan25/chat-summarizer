/* eslint-disable prettier/prettier */
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ logger: ['error', 'warn', 'log', 'debug', 'verbose'] });
  await app.listen(3000);
  console.log(process.env.OPENAI_API_KEY);

}
bootstrap();
