import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflows } from './entities/workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkflowDTO } from './dtos/createWorkflow.dto';

@Injectable()
export class WorkflowsService {


    constructor(
        @InjectRepository(Workflows)
        private readonly workflowRepisitories:Repository<Workflows>
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
}
