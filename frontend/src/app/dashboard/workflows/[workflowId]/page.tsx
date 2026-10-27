
"use client"
import { useState,useCallback } from 'react';
import { ReactFlow,NodeChange ,Background, Controls,Node,Edge,applyEdgeChanges,applyNodeChanges,MiniMap, Panel, EdgeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react'
import { useWorkflowStore } from '@/store/useWorkflowStore';
import WorkflowNodeUi from '@/components/feature/workflows/WorkflowNodeUi';
import { useWorkflowNodeForm } from '@/store/useWorkflowNodeForm';
import { stat } from 'fs';
import WorkflowNodesForm from '@/components/feature/workflows/WorkflowNodesForm';


const page = () => {
    // const workflowNodes:Node[] = [
    //     {
    //         id:"n1",
    //         position:{
    //             x:100,
    //             y:300
    //         },
    //         data:{
    //             label:"WebHook trigger"
    //         },
    //         type:"input",
         
    //     },
    //     {
    //         id:"n2",
    //         position:{
    //             x:200,
    //             y:600
    //         },
    //         data:{
    //             label:"HTTP Node"
    //         },
    //         type:"output"
    //     },
    //     {
    //         id:"n3",
    //         position:{
    //             x:700,
    //             y:600
    //         },
    //         data:{
    //             label:"Slack"
    //         },
    //         type:"output"
    //     },
    //         {
    //         id:"n3",
    //         position:{
    //             x:700,
    //             y:600
    //         },
    //         data:{
    //             label:"SLack"
    //         },
    //         type:"output"
    //     }
    // ]

    // const workflowEdges:Edge[] = [
    //     {
    //         id:"n1-n2",
    //         source:"n1",
    //         target:"n2",
    //     type:"default"        },
    //     {
    //         id:"n1-n3",
    //         source:"n1",
    //         target:"n3",
    //     type:"default"        },
     
    // ]
 

    const {nodes,edges,onEdgesChange,onNodesChange} = useWorkflowStore()

    const nodeTypes = {
        custom:WorkflowNodeUi
    }




  
   return (
    <div className='w-full h-full p-4  flex-wrap-reverse' >
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        panOnDrag={false}
        selectionOnDrag={true}
        panOnScroll={true}
        style={{color:"black"}}
        nodeTypes={nodeTypes}
        >
            <MiniMap bgColor='black' />
            <Background bgColor='black' />
            <Controls className='' />
            <Panel position="bottom-left">
    <h1 className='text-white' >My Flow</h1>
  </Panel>
        </ReactFlow>

      <WorkflowNodesForm/>
    </div>
   )
}

export default page