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
import { ISidebarNodeSummary } from "@/types/workflow"

const ListNodeSheet = ({ children }: { children: React.ReactNode }) => {

    const { data: nodes, isLoading } = useGetAllNodes()
    const addNode = useWorkflowStore((state)=>state.addNode);

    // Fixed: Added explicit return statement so it doesn't try to render the layout below during loading states
    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    const handleAddNodes=(nodeObj:ISidebarNodeSummary)=>{
        addNode(nodeObj);
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    {children}
                </SheetTrigger>
                {/* Made the sheet content a full-height flex container */}
                <SheetContent className="flex flex-col h-full p-0 gap-0">
                    <SheetHeader className="p-6 border-b-2 border-primary shrink-0" >
                        <SheetTitle>Some Useful Nodes</SheetTitle>
                        <SheetDescription>Select Nodes that you want to use in your workflow.</SheetDescription>
                    </SheetHeader>

                    {/* Scrollable Container Wrapper */}
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                        <div className="flex flex-col gap-5 justify-center p-6" >
                            {
                                nodes?.map((node) => {
                                    const {name,icon,description,comingSoon} = node
                                    return (
                                        <NodeSummaryCard 
                                            key={node.name} 
                                            onClick={()=>handleAddNodes(node)} 
                                            name={name} 
                                            icon={icon} 
                                            description={description} 
                                            comingSoon={comingSoon}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default ListNodeSheet
