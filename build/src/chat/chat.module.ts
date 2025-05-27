/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSummary } from './chat.entity';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LangchainService } from './langchaine.service';



@Module({
  imports: [TypeOrmModule.forFeature([ChatSummary])],
  controllers: [ChatController],
  providers: [ChatService, LangchainService],
})
export class ChatModule {}