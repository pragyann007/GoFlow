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