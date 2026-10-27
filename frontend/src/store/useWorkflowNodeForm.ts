import { ISidebarNodeSummary } from "@/types/workflow"
import {create} from "zustand"

interface WorkflowNodeForm {
    activeNodeId:string|null
    activeNodeBluePrint:any|null
    openFormPanel:(id:string,blueprint:any)=>void
    closeModalForm:()=>void
}

export const useWorkflowNodeForm = create<WorkflowNodeForm>((set)=>({
    activeNodeId:null,
    activeNodeBluePrint:null,
    openFormPanel:(id,blueprint)=>set((state)=>{


        return {
            activeNodeId:id,
            activeNodeBluePrint:blueprint
         }
    }),
    closeModalForm:()=>set((state)=>({
        activeNodeId:null,
        activeNodeBluePrint:null
    }))

}))