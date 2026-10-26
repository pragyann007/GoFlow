import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDTO } from './dtos/createWorkflow.dto';
import type  { Request } from 'express';
import { NodeRegistry } from 'src/nodes-engine/node.registry.service';
import { Authentication } from 'src/authentication/decorators/auth.decorator';
import { AuthType } from 'src/authentication/enums/auth-types.enum';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService,private readonly registry:NodeRegistry) {}


  @Authentication(AuthType.NONE)
  @Get("nodes")
  nodeTypes(){
    return this.registry.listAllNodes()

  }

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
