import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDTO } from './dtos/createWorkflow.dto';
import type  { Request } from 'express';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  async create(@Body() createWorkflowDTO:CreateWorkflowDTO){
    return this.workflowsService.create(createWorkflowDTO)
  }

  @Get()
  async getAll(@Req() req:Request){
    console.log("get all called..",req.headers.authorization)
    return this.workflowsService.getAll()
  }
}
