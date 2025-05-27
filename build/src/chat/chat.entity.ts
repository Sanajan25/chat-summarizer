/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatSummary{
    @PrimaryGeneratedColumn()
    id:number;
    @Column('text')
    chat:string;
    @Column('text')
    summary:string;
}