/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { HumanMessage} from "@langchain/core/messages";
import { ChatOllama } from '@langchain/ollama';

import { Injectable } from "@nestjs/common";


@Injectable()
export class LangchainService {
  
  private llm = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',

    model: process.env.OLLAMA_MODEL || 'tinyllama',  
  });
//   async summarize(chat:string):Promise<String>{
//     const promt =`You are a summarizer assistant. Summarize this teacher-child conversation in 2-3 child-friendly sentences:\n\n${chat}`;
//     const result=await this.llm.invoke([new HumanMessage(promt)]);
//     if (Array.isArray(result.content)) {
//         const textContent = result.content
//           .filter((message) => message && 'text' in message)  
//           .map((message: any) => message.text)  
//           .join(' ');  // Join the text content
  
//         return textContent || '';
//       } else {

//         return result.content?.toString() || '';
//       }
//     }
async summarize(chat: string): Promise<string> {
  const prompt = `You are a summarizer assistant. Summarize the following conversation between a teacher and child in 2-3 sentences with a child-friendly tone:\n\n${chat}`;

  const res = await this.llm.invoke([new HumanMessage(prompt)]);


  if (typeof res.content === 'string') {
    return res.content;
  }

  if (Array.isArray(res.content)) {
    const textParts = res.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text);

    return textParts.join('');
  }

  throw new Error('Unexpected LLM response format.');
}
async analyze(chat: { sender: string; content: string }[]): Promise<any> {
    const prompt = `
You are an expert chat analyzer. Given a conversation between a teacher and a trainee, extract question-answer dynamics.

Steps:
1. Identify all questions asked by the **Trainee**.
2. Categorize each question as: Why, Where, When, What, or Who (based on the question word).
3. Check if the **Child** replied after each question (within a few lines).
4. Count how many questions were asked and answered per type.
5. Calculate "% Trainee" = (Responded / Total Questions per type), rounded to 2 decimal places.
6. Include row-wise totals.

Respond **ONLY** with a markdown table in the format below — no extra commentary or explanation.

| S L | Parameter(s)       | Why | Where | When | What | Who | Total |
|-----|--------------------|-----|-------|------|------|-----|-------|
| 1   | Total Questions    |     |       |      |      |     |       |
| 2   | Responded          |     |       |      |      |     |       |
| 3   | % Trainee          |     |       |      |      |     |       |

Conversation:
${chat.map(c => `${c.sender}: ${c.content}`).join('\n')}
`;

  
    const result = await this.llm.invoke([new HumanMessage(prompt)]);
    return typeof result.content === 'string' 
    ? result.content 
    : JSON.stringify(result.content);
  }
  
}
