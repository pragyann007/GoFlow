    import { Processor,WorkerHost } from "@nestjs/bullmq";
    import { Logger } from "@nestjs/common";
    import { InjectRepository } from "@nestjs/typeorm";

    import { Job } from "bullmq";
    import { NodeExecuteProvider } from "src/nodes-engine/node-executor.provider";
    import { Workflows } from "./entities/workflow.entity";
    import { Repository } from "typeorm";

    @Processor("node-execute")
    export class NodeExecuteProcessor extends WorkerHost{
        private readonly logger  = new Logger(NodeExecuteProcessor.name)

        constructor(
            private readonly nodeExecuteProvider:NodeExecuteProvider,

            @InjectRepository(Workflows)
            private readonly workflowRepository:Repository<Workflows>
        ) {
            super();
        }

        async process(job: Job<any,any,string>,): Promise<any> {
            console.log("step4 ",job.id,job.data)


            switch(job.name){
                case "execute":
                    this.logger.log("Worker take the task",job.id,job.name)
                    
                    console.log("worker heree sirr..........")
                    const  datas = job.data;

                    const workflowId = datas.workflowId;

                    if(!workflowId) return ; 

                    const workflow = await this.workflowRepository.findOneBy({id: workflowId})


                    if(!workflow){
                        this.logger.log("Workflow with that id not found...")
                        return ;
                    }




                    await this.nodeExecuteProvider.executor(workflow)
                    
                    break
                default:
                    throw new Error("Unknown job name...")
            }
            
        }

    }
