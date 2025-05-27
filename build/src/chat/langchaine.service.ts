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
  async analyze(chat: { sender: string; content: string }[]): Promise<string> {
  const prompt = `
You are a precise chat analyzer. Given a conversation between a Trainee and a Child, extract question-answer dynamics.

Rules:
- ONLY count questions asked by the Trainee.
- Categorize each question based on the first word: Why, Where, When, What, or Who.
- Treat each question separately, even if they are the same type or asked consecutively.
- Match a response only if the next message(s) are from the Child and logically respond to the question.
- Count: Total Questions per type, how many were responded to, and calculate "% Trainee" = (Responded / Total Questions) * 100 rounded to 2 decimal places.
- Return totals per row.

Output format (return only this markdown table):

| S L | Parameter(s)       | Why | Where | When | What | Who | Total |
|-----|--------------------|-----|-------|------|------|-----|-------|
| 1   | Total Questions    |     |       |      |      |     |       |
| 2   | Responded          |     |       |      |      |     |       |
| 3   | % Trainee          |     |       |      |      |     |       |

Conversation:
${chat.map(c => `${c.sender}: ${c.content}`).join('\n')}
  `;

  const result = await this.llm.invoke([new HumanMessage(prompt)]);

  if (typeof result.content === 'string') {
    return result.content.trim();
  }

  return JSON.stringify(result.content);
}

}
