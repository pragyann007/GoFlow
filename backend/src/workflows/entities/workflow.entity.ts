

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { WorkflowExecution } from "./workflow-executions.entity"


@Entity()
export class Workflows{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"varchar",length:300,nullable:false})
    name:string

    @Column({type:"boolean",default:false})
    active:boolean

    @Column({type:"jsonb",nullable:true,default:[]})
    nodes:any[]

    @Column({type:"jsonb",nullable:true,default:{}})
    connections:Record<string,any>

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date

    @OneToMany(()=>WorkflowExecution,(workflowExecution)=>workflowExecution.workflowId)
    workflowExecutions:WorkflowExecution[]


   

}