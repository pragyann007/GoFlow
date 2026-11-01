import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDTO, WorkflowDTO } from './dtos/createWorkflow.dto';
import type { Request } from 'express';
import { NodeRegistry } from 'src/nodes-engine/node.registry.service';
import { Authentication } from 'src/authentication/decorators/auth.decorator';
import { AuthType } from 'src/authentication/enums/auth-types.enum';

@Controller('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly registry: NodeRegistry
  ) {}

  @Get("nodes")
  nodeTypes() {
    return this.workflowsService.getALlNodes();
  }

  @Post()
  async create(@Req() req: Request, @Body() createWorkflowDTO: CreateWorkflowDTO) {
    const user = req["user"];
    console.log("UU", user);
    // Pass user payload down to service
    return this.workflowsService.create(createWorkflowDTO, user);
  }

  @Post("save")
  async save(@Req() req: Request, @Body() workflowDTO: WorkflowDTO) {
    const user = req["user"];
    console.log(workflowDTO);
    return await this.workflowsService.saveWorkflow(workflowDTO, user);
  }

  @Get(":workflowId")
  async getWorkflows(@Req() req: Request, @Param("workflowId") workflowId: string) {
    const user = req["user"];
    return await this.workflowsService.getOne(workflowId, user);
  }

  @Post(":workflowId/execute")
  async execute(@Req() req: Request, @Param("workflowId") workflowId: string) {
    const user = req["user"];
    console.log("step1 ");
    return await this.workflowsService.executeWorkflow(workflowId, user);
  }

  @Get()
  async getAll(@Req() req: Request) {
    const user = req["user"];
    console.log("get all called..", req.headers.authorization);
    console.log("guse",user)
    return this.workflowsService.getAll(user);
  }

  @Post("execute/node")
  async executeOneNode(@Body() nodeData) {
    console.log("000No0000", nodeData);
    return await this.workflowsService.execteNode(nodeData);
  }
}