import { ICanvasNode, IWorkflowCreation } from "@/types/workflow";
import { Edge, Node } from "@xyflow/react";


interface IWorkflowData {
    workflowId:string
    workflowName:string
}

export const normaliseWorkflow= (workflowData:IWorkflowData,nodes:ICanvasNode[],edges:Edge[]):IWorkflowCreation=>{

    const {workflowId,workflowName} = workflowData

    const payload  = {
        id:workflowId,
        name:workflowName,
        active:true,
        nodes:nodes,
        connections:{
            edges
        }

    }

    return payload
    

}