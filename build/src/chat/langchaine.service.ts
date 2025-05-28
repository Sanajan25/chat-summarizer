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
  const formattedChat = chat
    .map(c => `${c.sender}: ${c.content.trim()}`)
    .join('\n');

 const prompt = `
You are a precise chat analyzer. Given a conversation between a Trainee and a Child, extract question-answer dynamics.

Rules:
- ONLY count questions asked by the Trainee.
- Categorize each question based on the first word of the question, normalized to one of: Why, Where, When, What, or Who.
  Treat contractions like "What’s" as "What", "Who’s" as "Who", etc.
- Treat each question separately, even if repeated or consecutive.
- Match a response only if the next message(s) are from the Child and logically respond to the question.
- Count the total questions per type and how many were responded to.
- Calculate "% Trainee" per type as (Responded / Total Questions) * 100, rounded to 2 decimal places.
- For the Total column, sum up all questions and all responses across types, then calculate "% Trainee" as (Total Responded / Total Questions) * 100 rounded to 2 decimals.
- DO NOT calculate the Total % Trainee by averaging the column percentages.
- Return ONLY the final markdown table below.
- Use whole numbers for counts and % with 2 decimal places WITHOUT % signs (e.g., 80.00 not 80%).

Output format (return only this markdown table):

| S L | Parameter(s)       | Why   | Where  | When   | What   | Who    | Total  |
|-----|--------------------|-------|--------|--------|--------|--------|--------|
| 1   | Total Questions    |       |        |        |        |        |        |
| 2   | Responded          |       |        |        |        |        |        |
| 3   | % Trainee          |       |        |        |        |        |        |

Conversation:
${formattedChat}
`;


  const result = await this.llm.invoke([new HumanMessage(prompt)]);

  if (typeof result.content === 'string') {
    return result.content.trim();
  }

  return JSON.stringify(result.content);
}
}
