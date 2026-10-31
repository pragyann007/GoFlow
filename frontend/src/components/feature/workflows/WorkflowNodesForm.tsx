import React, { memo } from 'react'
import { Settings2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useWorkflowNodeForm } from '@/store/useWorkflowNodeForm'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import ConfigPanel from './ConfigPanel'

const WorkflowNodesForm = () => {
  const activeNodeId = useWorkflowNodeForm((state) => state.activeNodeId)
  const activeNodeBluePrint = useWorkflowNodeForm((state) => state.activeNodeBluePrint)
  const closeModalForm = useWorkflowNodeForm((state) => state.closeModalForm)

  const updateNodeValue = useWorkflowStore((state) => state.updateNodeValues)
  const nodes = useWorkflowStore((state) => state.nodes)

  const activeNode = nodes.find((n) => n.id === activeNodeId)
  const nodeLabel =
    (activeNode?.data?.name as string) || (activeNode?.data?.type as string) || 'Node'
  const nodeType = (activeNode?.data?.type as string) || undefined

  const handleSubmit = (data: Record<string, any>) => {
    if (!activeNodeId) return
    updateNodeValue(activeNodeId, data)
  }

  return (
    <Sheet
      open={activeNodeId != null}
      onOpenChange={(open) => {
        if (!open) closeModalForm()
      }}
    >
      <SheetContent
        side="top"
        className="mx-auto flex h-[88vh] w-full max-w-[1400px] flex-col gap-0 overflow-hidden rounded-b-2xl border-x border-b border-border bg-card p-0 shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="shrink-0 flex-row items-center gap-3.5 border-b border-border bg-card px-6 py-4 pr-14">
          {/* <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Settings2 className="size-5" />
          </div> */}
          <div className="min-w-0 text-left">
            <SheetTitle className="truncate text-base leading-tight font-semibold tracking-tight">
              {nodeLabel}
            </SheetTitle>
            <SheetDescription className="mt-1 truncate text-xs">
              {nodeType ? (
                <>
                  <span className="font-mono">{nodeType}</span>
                  {' · '}
                </>
              ) : null}
              Set up this node, test it, and inspect its data.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="min-h-0 flex-1">
          {activeNodeId && (
            <ConfigPanel
              activeNodeId={activeNodeId}
              properties={activeNodeBluePrint ?? []}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default memo(WorkflowNodesForm)