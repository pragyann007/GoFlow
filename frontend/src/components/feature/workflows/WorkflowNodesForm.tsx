import React ,{memo}from 'react'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useWorkflowNodeForm } from '@/store/useWorkflowNodeForm';
import NodeConfigForm from './NodeConfigForm';
import { useWorkflowStore } from '@/store/useWorkflowStore';
const WorkflowNodesForm = () => {

    const activeNodeId = useWorkflowNodeForm((state) => state.activeNodeId);
    const activeNodeBluePrint = useWorkflowNodeForm((state) => state.activeNodeBluePrint);
    console.log("blueprint",activeNodeBluePrint)

    const updateNodeValue = useWorkflowStore((state)=>state.updateNodeValues)
    // Replace lines 83-85 with this:
    const closeModalForm = useWorkflowNodeForm((state) => state.closeModalForm);

    const handleSubmit = (data:Record<string,any>)=>{

        if(!activeNodeId) return ; 
        updateNodeValue(activeNodeId,data);



    }

    const isSheetOpen = activeNodeId == null ? false : true
    return (
        <div className='p-4'  >
            <Sheet open={isSheetOpen} onOpenChange={(open) => {
                if (!open) {
                    closeModalForm()
                }
            }}  >

                <SheetContent className='w-[600px] ml-150   min-h-250 flex items-center justify-center  ' side='top' >
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>This action cannot be undone.</SheetDescription>
                    </SheetHeader>
                    <NodeConfigForm properties={activeNodeBluePrint ?? []} onSubmit={handleSubmit}  />
                </SheetContent>

                <SheetClose />
            </Sheet>
        </div>
    )
}

export default memo(WorkflowNodesForm)