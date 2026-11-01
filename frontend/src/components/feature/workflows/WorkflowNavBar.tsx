"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { MoonIcon, Play, Plus, Save, SunIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes"
import ListNodeSheet from './ListNodeSheet'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { normaliseWorkflow } from '@/app/utils/workflowNormalisation'
import { useParams } from 'next/navigation';
import { useCreateWorkflow, useExecuteWorkflow, useFetchWorkflow } from '@/hooks/useWorkflows'

const WorkflowNavBar = () => {
    const { setTheme, resolvedTheme } = useTheme()
    const params = useParams()
    const workflowId = Array.isArray(params.workflowId) ? params.workflowId[0] : params.workflowId ;

    if (!workflowId) return null;

    const changeTheme = () => {
        setTheme(resolvedTheme == "dark" ? "light" : "dark")
    }

    const nodes = useWorkflowStore((state) => state.nodes)
    const edges = useWorkflowStore((state) => state.edges)
    
    const [wrokflowName, setWorkflowName] = useState("my workflow-1")

    const { mutate: workflow, isPending: isCreating } = useCreateWorkflow()
    const { mutate: execute, isPending: isExecuting } = useExecuteWorkflow()

    const { data } = useFetchWorkflow(workflowId)

    // Handle name synchronization safely inside useEffect
    useEffect(() => {
        if (data?.workflow?.name) {
            setWorkflowName(data.workflow.name);
        }
    }, [data]);
    
    const saveWorkflow = () => {
        const workflowData = {
            workflowId,
            workflowName: wrokflowName
        }
        let res = normaliseWorkflow(workflowData, nodes, edges)
        workflow(res)
    }

    const executeWorkflow = () => {
        execute(workflowId)
    }

    return (
        <div className='w-full h-20'>
            <div className='w-full h-full border border-slate-800 flex justify-between items-center p-4'>
                <div className='flex gap-4 items-center'>
                    <SidebarTrigger className="h-8 w-8 cursor-pointer" />
                    <Input 
                        className='border-none focus-visible:ring-0' 
                        value={wrokflowName} 
                        onChange={(e) => setWorkflowName(e.target.value)} 
                    />
                </div>

                <div className='flex gap-8 items-center'>
                    <Button variant={"outline"} onClick={changeTheme}>
                        {resolvedTheme == "dark" ? <MoonIcon /> : <SunIcon />}
                    </Button>
                    <ListNodeSheet>
                        <Button variant={"outline"} className={"flex gap-2"}>
                            <Plus />
                            Add Node
                        </Button>
                    </ListNodeSheet>

                    <Button disabled={isCreating} onClick={saveWorkflow} className={"flex gap-2"}>
                        <Save />
                        Save Workflow
                    </Button>

                    <Button disabled={isExecuting} onClick={executeWorkflow} className={"flex gap-2"}>
                        <Play />
                        Execute Workflow
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default WorkflowNavBar