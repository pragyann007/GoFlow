import { workflowService } from "@/services/workflow.service"
import { ISidebarNodeSummary } from "@/types/workflow"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"



export const useGetAllNodes = ()=>{
    return useQuery<ISidebarNodeSummary[],Error>({
        queryKey:["nodes"],
        queryFn:workflowService.fetchAllNode,
        staleTime:1000*60*50

    })
}

export const useFetchWorkflow = (workflowId:string)=>{
    return useQuery(
            {
                queryKey:["workflows",workflowId],
                queryFn: () => workflowService.fetchWorkflowById(workflowId),
                enabled:!!workflowId
            }
    )
}

export const useCreateWorkflow = ()=>{
    
    return useMutation({
        mutationFn:workflowService.createWorkflow,
        onSuccess:(data)=>{
            toast.success("Workflow created..")
        },
          onError: (error: any) => {
                    toast.error(error.message || "Workflow creation failed"); // ❌ Toast here
                  },
    })
}


export const useExecuteWorkflow = ()=>{

    return useMutation({
        mutationFn:workflowService.executeWorkflow,
        onSuccess:(data)=>{
            toast.success("Executing Workflow..")
        },
        onError: (error: any) => {
                  toast.error(error.message || "Workflow creation failed"); // ❌ Toast here
                },
    })
}


export const useExecuteNode=(nodeData:Record<string,any>)=>{

    return useMutation(
        {
            mutationFn: () => workflowService.executeNode(nodeData),
            onSuccess:()=>{
                toast.success("Node executed sucessfully")
            },
            onError: (error: any) => {
                toast.error(error.message || "Workflow creation failed"); // ❌ Toast here
              },

        }
    )
}