import { Edge, Node } from "@xyflow/react";


interface IWorkflowData {
    workflowId:string
    workflowName:string
}

export const normaliseWorkflow= (workflowData:IWorkflowData,nodes:Node[],edges:Edge[])=>{

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