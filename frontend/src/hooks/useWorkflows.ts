import { workflowService } from "@/services/workflow.service"
import { ISidebarNodeSummary } from "@/types/workflow"
import { useQuery } from "@tanstack/react-query"



export const useGetAllNodes = ()=>{
    return useQuery<ISidebarNodeSummary[],Error>({
        queryKey:["nodes"],
        queryFn:workflowService.fetchAllNode,
        staleTime:1000*60*50

    })
}