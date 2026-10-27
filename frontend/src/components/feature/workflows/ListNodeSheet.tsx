"use client"
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
import { useGetAllNodes } from "@/hooks/useWorkflows"
import DynamicIcon from "../common/DynamicIcon"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"
import { NodeSummaryCard } from "./NodeSummaryCard"
import { useWorkflowStore } from "@/store/useWorkflowStore"
import { stat } from "fs"
import { ISidebarNodeSummary } from "@/types/workflow"

const ListNodeSheet = ({ children }: { children: React.ReactNode }) => {

    const { data: nodes, isLoading } = useGetAllNodes()


    const addNode = useWorkflowStore((state)=>state.addNode);



    if (isLoading) {
        <Spinner />
    }


    const handleAddNodes=(nodeObj:ISidebarNodeSummary)=>{
        addNode(nodeObj);
        
    }

    return (
        <>
            <Sheet>
                <SheetTrigger>
                    {children}
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader className="border-b-2 border-primary" >
                        <SheetTitle>Some Useful Nodes</SheetTitle>
                        <SheetDescription>Select Nodes that you want to use in your workflow.</SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col gap-5  justify-center  p-8 " >
                        {
                            nodes?.map((node) => {
                            const {name,icon,description} = node
                                return (
                                    <NodeSummaryCard onClick={()=>handleAddNodes(node)} name={name} icon={icon} description={description} />
                                )
}
                        )
                        }
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default ListNodeSheet