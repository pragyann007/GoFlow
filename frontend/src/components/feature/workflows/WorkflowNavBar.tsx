"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { MoonIcon, Play, Plus, SunIcon } from 'lucide-react'
import React, { useState } from 'react'
import {useTheme} from "next-themes"
import ListNodeSheet from './ListNodeSheet'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { normaliseWorkflow } from '@/app/utils/workflowNormalisation'

import { useParams } from 'next/navigation';
import { useCreateWorkflow } from '@/hooks/useWorkflows'

const WorkflowNavBar = () => {
    const {setTheme,resolvedTheme} = useTheme()
    console.log("theme",resolvedTheme)
    const params = useParams()
    const changeTheme = ()=>{
        setTheme(resolvedTheme=="dark"?"light":"dark")

    }

    const nodes = useWorkflowStore((state)=>state.nodes)
    const [wrokflowName,setWorkflowName] = useState("my workflow-1 ")

    const edges = useWorkflowStore((state)=>state.edges)

    const {mutate:workflow,isPending} = useCreateWorkflow()
    const executeWorkflow = ()=>{
        alert("hiiiii node ready vo ki k hoo")
        if(!params.workflowId) return
        const workflowData = {
            workflowId:Array.isArray(params.workflowId) ? params.workflowId[0] : params.workflowId,
            workflowName:wrokflowName
        }
        let res = normaliseWorkflow(workflowData,nodes,edges)
        workflow(res)

        


    }
    return (
        <div className='w-full h-20   ' >
            <div className='w-full h-full border-1 border-slate-800 flex justify-between items-center p-4 ' >
                <div className='flex gap-4 '  >
                    <SidebarTrigger className="h-8 w-8 cursor-pointer" />
                    <Input className='border-none focus:border-none' defaultValue={wrokflowName} />
                </div>

                <div className='flex gap-8 items-center ' >

                    <Button variant={"outline"} onClick={changeTheme} >
                        {
                            resolvedTheme=="dark" ?  <MoonIcon/> : <SunIcon/>
 
                        }
                    </Button>
                    <ListNodeSheet>

                        <Button variant={"outline"} className={"flex gap-2 "} >
                            <Plus />
                            Add Node
                        </Button>

                    </ListNodeSheet>

                    <Button onClick={executeWorkflow} className={"flex gap-2 "} >
                            <Play />
                            Execute Workflow
                        </Button>

                </div>


            </div>
        </div>
    )
}

export default WorkflowNavBar