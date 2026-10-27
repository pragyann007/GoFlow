
import { ISidebarNodeSummary } from "@/types/workflow";
import { applyEdgeChanges, applyNodeChanges, Edge, EdgeChange, Node, NodeChange } from "@xyflow/react"

import {create} from "zustand"
interface WorkflowState{
    nodes:Node[] ;
    edges:Edge[];

    onNodesChange:(changes:NodeChange[])=>void;
    onEdgesChange:(changes:EdgeChange[])=>void;

    addNode:(nodeBlueprint:ISidebarNodeSummary)=>void;

}

export const useWorkflowStore = create<WorkflowState>((set)=>({
    nodes:[],
    edges:[],
    onNodesChange:(changes:NodeChange[])=>set((state)=>({
        nodes:applyNodeChanges(changes,state.nodes)
    })),
    onEdgesChange:(changes:EdgeChange[])=>set((state)=>({
        edges:applyEdgeChanges(changes,state.edges)
    })),
    addNode:(nodeBluePrint:ISidebarNodeSummary)=>set((state)=>{

        const {name:label,icon,description,inputs,outputs,properties,type} = nodeBluePrint

        const newNode:Node={
            id:crypto.randomUUID(),
            type:"custom",
            data:{
               ...nodeBluePrint
                

            },
            position:{
                x:100,
                y:100
            }

        }

        return {nodes:[...state.nodes,newNode]}

    })


    
}))