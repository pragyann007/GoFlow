import { api } from "@/lib/axios";
import {ISidebarNodeSummary} from "../types/workflow"

export const workflowService = {

    async fetchAllNode():Promise<ISidebarNodeSummary[]>{
        const {data} = await api.get("/workflows/nodes")

        if(!data){
            throw new Error("Error fetching nodes.")
        }


        return data 

    }

}