import { api } from "@/lib/axios";
import {ISidebarNodeSummary, IWorkflowCreation} from "../types/workflow"

export const workflowService = {

    async fetchAllNode():Promise<ISidebarNodeSummary[]>{
        const {data} = await api.get("/workflows/nodes")

        if(!data){
            throw new Error("Error fetching nodes.")
        }


        return data 

    },
    
    async fetchWorkflowById(workflowId:string){

        const {data} = await api.get(`/workflows/${workflowId}`)
        return data ; 

    },
    async createWorkflow(workflowData:IWorkflowCreation){
        const {data} = await api.post("/workflows/save",workflowData);
        return data ; 


    },
    async executeWorkflow(workflowId:string){
        const {data} = await api.post(`/workflows/${workflowId}/execute`);
        return data 
    }

}