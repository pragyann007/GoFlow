import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflows } from './entities/workflow.entity';
import { WorkflowExecution } from './entities/workflow-executions.entity';
import { NodeModule } from 'src/nodes-engine/node.module';

@Module({
  imports:[TypeOrmModule.forFeature([Workflows,WorkflowExecution]),NodeModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
})
export class WorkflowsModule {}
