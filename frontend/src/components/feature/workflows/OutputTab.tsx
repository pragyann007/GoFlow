import React from 'react'
import { ArrowUpFromLine, Play } from 'lucide-react'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { EmptyState, JsonView, PaneHeader, Pill } from './PanelUi'

const OutputTab = ({ nodeId }: { nodeId: string }) => {
  const nodeOutput = useWorkflowStore((state) => state.nodeOutputs[nodeId])
  const hasOutput = nodeOutput !== undefined && nodeOutput !== null

  const itemCount = Array.isArray(nodeOutput) ? nodeOutput.length : hasOutput ? 1 : 0

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/60">
      <PaneHeader
        title="Output"
        description="Result of this node"
        icon={<ArrowUpFromLine className="size-4" />}
        badge={
          hasOutput ? (
            <Pill tone="success">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Pill>
          ) : undefined
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {hasOutput ? (
          <div className="p-4">
            <section className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
              <JsonView data={nodeOutput} className="max-h-[calc(88vh-10rem)]" />
            </section>
          </div>
        ) : (
          <EmptyState
            icon={<Play className="size-5" />}
            title="No output yet"
            description="Press the play button on this node to run a test and see what it returns."
          />
        )}
      </div>
    </div>
  )
}

export default OutputTab