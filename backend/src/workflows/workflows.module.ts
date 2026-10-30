import { Logger, Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflows } from './entities/workflow.entity';
import { WorkflowExecution } from './entities/workflow-executions.entity';
import { NodeModule } from 'src/nodes-engine/node.module';
import { BullModule } from '@nestjs/bullmq';
import { NodeExecuteProcessor } from './workflow-execute.processor';

@Module({
  imports:[
    TypeOrmModule.forFeature([Workflows,WorkflowExecution]),
    NodeModule,
    BullModule.registerQueue({
      name:"node-execute"
    }),

  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService,NodeExecuteProcessor],
})
export class WorkflowsModule {}
