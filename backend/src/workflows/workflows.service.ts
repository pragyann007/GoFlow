import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflows } from './entities/workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkflowDTO, WorkflowDTO } from './dtos/createWorkflow.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WorkflowsService {


    constructor(
        @InjectRepository(Workflows)
        private readonly workflowRepisitories:Repository<Workflows>,

        @InjectQueue("node-execute") private readonly nodeExecuteQuee:Queue
    ){}

    async create(createWorkflowDTO:CreateWorkflowDTO){

    try {
            let  workflow =  this.workflowRepisitories.create({name:createWorkflowDTO.name})
            workflow = await this.workflowRepisitories.save(workflow);
    
            return {
                workflow
            }
    
    } catch (error) {
        return   new InternalServerErrorException("Something went wrong")
        
    }
       

        


    }


    async saveWorkflow(createWorkflowDTO:WorkflowDTO){

        const workflowWExists = await this.workflowRepisitories.findOneBy({id:createWorkflowDTO.id})

        if(!workflowWExists){
            throw new NotFoundException("Workflow not found..")
        }

        const {name,active,connections,nodes} = createWorkflowDTO

        const saveWorkflow = await this.workflowRepisitories.update({
            id:createWorkflowDTO.id,
        },{
            name,
            active,
            nodes,
            connections
        })



        return {message:"Workflow saved succesfully..",updatedWorkflow:saveWorkflow}
    }

    async getAll(){
     try {
           const workflows = await this.workflowRepisitories.find()
   
           return {
               workflows
           }
     } catch (error) {
        return   new InternalServerErrorException("Something went wrong")

        
     }
    }

    async getOne(workflowId:string){

        if(!workflowId) {
            return  
        }

        const workflowExists = await this.workflowRepisitories.findOneBy({id:workflowId})

        if(!workflowExists){
            throw new NotFoundException("Workflow not found");
        }

        return {
            workflow:workflowExists
        }


    }

    async executeWorkflow (workflowId:string){


        await this.nodeExecuteQuee.add("execute",{workflowId})

        return {"message":"Workflow executing.."}





    }
}
