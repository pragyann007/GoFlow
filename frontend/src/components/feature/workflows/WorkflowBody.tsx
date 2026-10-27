"use client"

import { api } from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export interface AutomationWorkflow {
    id: string;
    name: string;
    active: boolean;
    nodes: any[]; // Replace 'any' with a specific Node interface if you have one (e.g., WorkflowNode[])
    connections: Record<string, any>; // Represents an object with dynamic keys/values (e.g., Record<string, Connection>)
    createdAt: string; // ISO 8601 Date string
    updatedAt: string; // ISO 8601 Date string
  }
  
const WorkflowBody = () => {
//     const date = new Date(); // Or new Date('2026-10-23')

// const formattedDate = date.toLocaleDateString('en-US', {
//   day: 'numeric',
//   month: 'long'
// });

const [workflows,setWorkflows]=useState<AutomationWorkflow[]>()


useEffect(()=>{

    const fetchWorkflows = async ()=>{
        const res = await api.get("/workflows")
        setWorkflows(res.data.workflows)

    }
    fetchWorkflows()
},[])
    // const workflows =[
    //     {id:"ala",title:"Email Automation",createdAt:"October 23 "},
    //     {id:"cla",title:"Whatsapp Agent Automation",createdAt:"October 13 "},
    //     {id:"calaa",title:"Customer Support Agent",createdAt:"October 43 "},

    // ]
    const router = useRouter()

    const redirectWorkflow = (workflowId:string)=>{
        router.push(`/dashboard/workflows/${workflowId}`)

    }


    if(!workflows){
        return <h1>Loading....</h1>
    }
  return (
    <div className="mt-10 flex flex-col gap-8">
     {
        workflows.map((workflow)=>{
            return (
                <div key={workflow.id} onClick={()=>redirectWorkflow(workflow.id)} className='w-full min-h-10 border-border border-2 rounded-xl p-3 flex justify-between items-center cursor-pointer  ' >
                <div className='flex flex-col gap-4 ' >
                <h3 className='text-md' >{workflow.name}</h3>
                <span className='text-xs text-foreground' >Last Updated just now | Created {workflow.createdAt}</span>
                
                </div>
    
                <div>
                <p className='cursor-pointer text-xl'  >...</p>
                </div>
    
    
    
            </div>
            )
        })
     }
    </div>
  )
}

export default WorkflowBody