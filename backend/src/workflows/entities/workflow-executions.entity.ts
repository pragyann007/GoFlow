

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Workflows } from "./workflow.entity"


export enum STATUS {
    PENDING="pending",
    FAILED="failed",
    COMPLETED="completed"
}

@Entity()
export class WorkflowExecution{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"uuid",nullable:false})
    workflowId:string

    @Column({type:"enum",enum:STATUS,default:STATUS.PENDING})
    status:STATUS

    @Column({type:"jsonb",nullable:false})
    executionData:JSON


    @CreateDateColumn()
    startedAt:Date

    @CreateDateColumn()
    endedAt:Date

    @ManyToOne(()=>Workflows,(workflow)=>workflow.workflowExecutions,{onDelete:"CASCADE"})
    @JoinColumn({ name: 'workflowId' }) 
    workflow:Workflows


   

}