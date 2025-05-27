/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';


@Controller('chat') // ← This is essential
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('summarize')
  summarize(@Body('chat') chat: string) {
    return this.chatService.summarizeAndSave(chat);
  }

  @Get('all')
  getAll() {
    return this.chatService.findAll();
  }
  @Post('analyze')
async analyzeTable(@Body('chat') chat: { sender: string; content: string }[]) {
  return this.chatService.analyzeQuestions(chat);
}
}
