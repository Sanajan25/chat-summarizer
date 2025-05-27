/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */


/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSummary } from './chat.entity';
import { Repository } from 'typeorm';
import { LangchainService } from './langchaine.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSummary)
    private repository:Repository<ChatSummary>,
    private langchain:LangchainService,
  ){}
  async summarizeAndSave(chat:string) {
    const summary=await this.langchain.summarize(chat);
    const entry =this.repository.create({chat,summary})
    return this.repository.save(entry);
    
  }
  findAll(){
    return this.repository.find();
  }
  async analyzeQuestions(chat: { sender: string; content: string }[]): Promise<any> {
  return this.langchain.analyze(chat);
}
   
}
    
