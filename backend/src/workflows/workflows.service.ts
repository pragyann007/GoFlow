import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflows } from './entities/workflow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkflowDTO, WorkflowDTO } from './dtos/createWorkflow.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NodeRegistry } from 'src/nodes-engine/node.registry.service';
import { NodeExecuteProvider } from 'src/nodes-engine/node-executor.provider';

@Injectable()
export class WorkflowsService {

    constructor(
        @InjectRepository(Workflows)
        private readonly workflowRepisitories: Repository<Workflows>,
        private readonly registry: NodeRegistry,
        @InjectQueue("node-execute") private readonly nodeExecuteQuee: Queue,
        private readonly nodeProvider: NodeExecuteProvider
    ) {}

    async create(createWorkflowDTO: CreateWorkflowDTO, user: any) {
        try {
            // Extract the user ID from JWT payload ('sub' or 'id')
            const userId = user?.sub || user?.id;
            
            let workflow = this.workflowRepisitories.create({
                name: createWorkflowDTO.name,
                userId: userId // Bind tenancy!
            });
            workflow = await this.workflowRepisitories.save(workflow);
    
            return { workflow };
        } catch (error) {
            return new InternalServerErrorException("Something went wrong");
        }
    }

    async saveWorkflow(createWorkflowDTO: WorkflowDTO, user: any) {
        const userId = user?.sub || user?.id;

        // Ensure the workflow belongs to this specific user
        const workflowExists = await this.workflowRepisitories.findOneBy({ 
            id: createWorkflowDTO.id, 
            userId: userId 
        });

        if (!workflowExists) {
            throw new NotFoundException("Workflow not found..");
        }

        const { name, active, connections, nodes } = createWorkflowDTO;

        const updatedWorkflow = await this.workflowRepisitories.update({
            id: createWorkflowDTO.id,
            userId: userId
        }, {
            name,
            active,
            nodes,
            connections
        });

        return { message: "Workflow saved succesfully..", updatedWorkflow };
    }

    async getAll(user: any) {
        try {
            const userId = user?.sub || user?.id;
            console.log("id gra",userId)
            
            // Only fetch workflows belonging to the logged-in user
            const workflows = await this.workflowRepisitories.find({
                where: { userId }
            });
            console.log("workflows",workflows)
   
            return { workflows };
        } catch (error) {
            return new InternalServerErrorException("Something went wrong");
        }
    }

    async getOne(workflowId: string, user: any) {
        if (!workflowId) return;

        const userId = user?.sub || user?.id;

        // Ensure cross-tenant access is blocked
        const workflowExists = await this.workflowRepisitories.findOneBy({ 
            id: workflowId, 
            userId: userId 
        });

        if (!workflowExists) {
            throw new NotFoundException("Workflow not found");
        }

        return { workflow: workflowExists };
    }

    async getALlNodes() {
        return this.registry.listAllNodes();
    }

    async executeWorkflow(workflowId: string, user: any) {
        const userId = user?.sub || user?.id;

        // Security check: Verify the workflow belongs to the user before queuing execution
        const workflowExists = await this.workflowRepisitories.findOneBy({ 
            id: workflowId, 
            userId: userId 
        });

        if (!workflowExists) {
            throw new NotFoundException("Workflow not found or unauthorized");
        }

        await this.nodeExecuteQuee.add("execute", { workflowId });


        return { "message": "Workflow executing.." };
    }

    async execteNode(data) {
    
        const resolvedValues = this.nodeProvider.resolvedParameters(data.nodeData.values, data.incomingDatas);
    
        const res = await this.nodeProvider.executeActualNodeLogic(
            data.nodeData.type, 
            resolvedValues, 
            data.incomingDatas
        );
    
        return res;
    }
}