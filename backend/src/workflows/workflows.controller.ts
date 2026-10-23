import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDTO } from './dtos/createWorkflow.dto';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  async create(@Body() createWorkflowDTO:CreateWorkflowDTO){
    return this.workflowsService.create(createWorkflowDTO)
  }

  @Get()
  async getAl(){
    return this.workflowsService.getAll()
  }
}
