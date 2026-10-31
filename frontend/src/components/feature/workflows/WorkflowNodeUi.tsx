import { Handle, Position } from '@xyflow/react'
import React from 'react'
import DynamicIcon from '../common/DynamicIcon'
import { Play, Settings } from 'lucide-react'
import ListNodeSheet from './ListNodeSheet'
import { useWorkflowNodeForm } from '@/store/useWorkflowNodeForm'
import { ISidebarNodeSummary } from '@/types/workflow'
import { useExecuteNode } from '@/hooks/useWorkflows'
import { useWorkflowStore } from '@/store/useWorkflowStore'

interface ReactFlowProps {
    id:string
    data:ISidebarNodeSummary
}

const WorkflowNodeUi = ({id,data}:ReactFlowProps) => {
    const {openFormPanel} = useWorkflowNodeForm()
    const {mutate:executeNode,isPending,isError,data:nodeData} = useExecuteNode(data)
    const setNodeOutput = useWorkflowStore((state)=>state.setNodeOutputs);
    const displayForm = () => {
    
        const {properties,...metadata} = data
        console.log("props",data)
        openFormPanel(id,properties)
        
    }

    const singleNodeExecution = () => {
        executeNode(undefined, {
            onSuccess: (response) => {
                // 'response' is the fresh data returned by your backend API
                const resultData = response?.data || response;
                
                console.log("Backend response success:", resultData);
                
                // Save it directly to Zustand store
                setNodeOutput(id, resultData);
            },
            onError: (error) => {
                console.error("Execution failed:", error);
            }
        });
    }
    return (
        <div onDoubleClick={displayForm}  className='flex group flex-col gap-2  min-w-[200px]  ' >
         
         <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
           <div className="flex gap-6 " >
           <Settings onClick={displayForm} className="text-muted-foreground hover:text-primary" size={15} />
           <Play onClick={singleNodeExecution} className="text-muted-foreground hover:text-primary" size={15} />
           </div>

            </div>
            
         

            <div className='flex items-center gap-3 p-3 border rounded-xl bg-card border-border shadow-md  ' >
                <Handle type='target' position={Position.Left} className='w-2 h-2 bg-primary!' />

                <div className='flex items-center justify-center p-2 rounded-lg bg-muted text-primary' >
                    <DynamicIcon iconName={data.icon} />

                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{data.name}</span>
                </div>

                <Handle type='source' position={Position.Right} className='w-2 h-2 bg-primary!' />


            </div>

        </div>
    )
}

export default WorkflowNodeUi