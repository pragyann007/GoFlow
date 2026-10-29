import { ISidebarNodeSummary } from "@/types/workflow"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface WorkflowNodeForm {
    activeNodeId: string | null
    activeNodeBluePrint: any | null
    openFormPanel: (id: string, blueprint: any) => void
    closeModalForm: () => void
}

export const useWorkflowNodeForm = create<WorkflowNodeForm>()(
    devtools(
        (set) => ({
            activeNodeId: null,
            activeNodeBluePrint: null,

            openFormPanel: (id, blueprint) => 
                set(() => {
                    return {
                        activeNodeId: id,
                        activeNodeBluePrint: blueprint
                    }
                }, false, "openFormPanel"), // Named action for devtools

            closeModalForm: () => 
                set(() => ({
                    activeNodeId: null,
                    activeNodeBluePrint: null
                }), false, "closeModalForm") // Named action for devtools
        }),
        { name: "WorkflowNodeForm" } // Optional: Isolates this specific store inside the devtools browser extension dropdown
    )
)
