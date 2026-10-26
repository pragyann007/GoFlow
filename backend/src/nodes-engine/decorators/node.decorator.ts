import { SetMetadata } from "@nestjs/common";


export const WORKFLOW_NODE = "NODE";
export const Node = ()=>SetMetadata(WORKFLOW_NODE,true)