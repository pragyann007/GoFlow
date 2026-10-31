import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDTO,WorkflowDTO } from './dtos/createWorkflow.dto';
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
    return this.workflowsService.getALlNodes()

  }

  @Post()
  async create(@Body() createWorkflowDTO:CreateWorkflowDTO){
    return this.workflowsService.create(createWorkflowDTO)
  }

  @Authentication(AuthType.NONE)
  @Post("save")
  async save(@Body() workflowDTO:WorkflowDTO ){
    console.log(workflowDTO)
    return await this.workflowsService.saveWorkflow(workflowDTO)


  }


  @Authentication(AuthType.NONE)
  @Get(":workflowId")
  async getWorkflows(@Param("workflowId") workflowId:string){

    return await this.workflowsService.getOne(workflowId)

  }


  @Authentication(AuthType.NONE)
  @Post(":workflowId/execute")
  async execute (@Param("workflowId") workflowId:string){

    console.log("step1 ")

    return await this.workflowsService.executeWorkflow(workflowId)


  }

  @Get()
  async getAll(@Req() req:Request){
    console.log("get all called..",req.headers.authorization)
    return this.workflowsService.getAll()
  }


  @Authentication(AuthType.NONE)

  @Post("execute/node")
  async executeOneNode(@Body() nodeData ){
    console.log("000No0000",nodeData)

    return await this.workflowsService.execteNode(nodeData)

  }
}
