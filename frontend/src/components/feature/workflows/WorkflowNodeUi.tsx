import { Handle, Position } from '@xyflow/react'
import React from 'react'
import DynamicIcon from '../common/DynamicIcon'
import { Play, Settings, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useWorkflowNodeForm } from '@/store/useWorkflowNodeForm'
import { ISidebarNodeSummary } from '@/types/workflow'
import { useExecuteNode } from '@/hooks/useWorkflows'
import { useWorkflowStore } from '@/store/useWorkflowStore'

interface ReactFlowProps {
    id: string
    data: ISidebarNodeSummary
}

const WorkflowNodeUi = ({ id, data }: ReactFlowProps) => {
    const { openFormPanel } = useWorkflowNodeForm()
    const nodeOutputs = useWorkflowStore((state) => state.nodeOutputs)

    const status = useWorkflowStore((state) => state.nodeStatus?.[id]);
    const nodeOutput = useWorkflowStore((state) => state.nodeOutputs[id])

    // Adjust casing check based on what your constants emit ('RUNNING' vs 'running')
    const isRunning = status === 'RUNNING' || status === 'running';
    const isSuccess = status === 'SUCCESS' || status === 'success';
    const isFailed = status === 'FAILED' || status === 'failed';   

    const edges = useWorkflowStore((state) => state.edges);
    
    const getIncomingData = () => {
        const sources = edges.filter((e) => e.target == id)
        const incomingDatas: any[] = []
        for (const s of sources) {
            let output = nodeOutputs[s.source]    
            if (output) {
                incomingDatas.push(output)
            }
        }
        return incomingDatas
    }

    const currentIncomingDatas = getIncomingData()
    const { mutate: executeNode, isPending } = useExecuteNode(data, currentIncomingDatas)
    const setNodeOutput = useWorkflowStore((state) => state.setNodeOutputs);

    const displayForm = () => {
        const { properties, ...metadata } = data;
        openFormPanel(id, properties);
    }

    const singleNodeExecution = () => {
        executeNode(undefined, {
            onSuccess: (response) => {
                const resultData = response?.data || response;
                setNodeOutput(id, resultData);
            },
            onError: (error) => {
                console.error("Execution failed:", error);
            }
        });
    }

    return (
        <div onDoubleClick={displayForm} className='flex group flex-col gap-2 min-w-[200px]'>
         
            {/* Top Hover Controls */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10">
               <div className="flex gap-6 bg-background/80 backdrop-blur px-2 py-0.5 rounded-full border shadow-sm">
                   <Settings onClick={displayForm} className="text-muted-foreground hover:text-primary" size={15} />
                   <Play onClick={singleNodeExecution} className={`text-muted-foreground hover:text-primary ${isPending ? 'animate-spin' : ''}`} size={15} />
               </div>
            </div>
            
            {/* Main Node Box (Made relative so absolute child badges lock to its bounds) */}
            <div className='relative flex items-center gap-3 p-3 border rounded-xl bg-card border-border shadow-md'>
                <Handle type='target' position={Position.Left} className='w-2 h-2 bg-primary!' />

                <div className='flex items-center justify-center p-2 rounded-lg bg-muted text-primary'>
                    <DynamicIcon iconName={data.icon} />
                </div>
                
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{data.name}</span>
                </div>

                {/* Bottom-Right Status Indicator Badge */}
                {(isRunning || isSuccess || isFailed) && (
                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-md bg-background border z-20">
                        {isRunning && (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                {/* <span className="text-blue-500">running</span> */}
                            </>
                        )}
                        {isSuccess && (
                            <>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                {/* <span className="text-green-500">success</span> */}
                            </>
                        )}
                        {isFailed && (
                            <>
                                <XCircle className="w-3 h-3 text-destructive" />
                                {/* <span className="text-destructive">failed</span> */}
                            </>
                        )}
                    </div>
                )}

                <Handle type='source' position={Position.Right} className='w-2 h-2 bg-primary!' />
            </div>
        </div>
    )
}

export default WorkflowNodeUi