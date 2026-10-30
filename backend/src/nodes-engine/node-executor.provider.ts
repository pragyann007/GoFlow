import { Injectable } from "@nestjs/common";
import { Workflows } from "src/workflows/entities/workflow.entity";

@Injectable()

export class NodeExecuteProvider {


    async executor(workflow:Workflows){

    }
}