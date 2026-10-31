import React, { useMemo } from 'react'
import { Edge } from '@xyflow/react'
import { ArrowDownToLine, Workflow } from 'lucide-react'
import { useWorkflowStore } from '@/store/useWorkflowStore'
import { EmptyState, JsonView, PaneHeader, Pill } from './PanelUi'

// Walk backwards through the graph to collect every upstream node id
const getAllAncestorNodeIds = (currentNodeId: string, edges: Edge[]): string[] => {
  const parentMap = new Map<string, string[]>()
  for (const edge of edges) {
    if (!parentMap.has(edge.target)) parentMap.set(edge.target, [])
    parentMap.get(edge.target)!.push(edge.source)
  }

  const visited = new Set<string>()
  const queue: string[] = [currentNodeId]
  const ancestors: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const parent of parentMap.get(current) || []) {
      if (!visited.has(parent)) {
        visited.add(parent)
        ancestors.push(parent)
        queue.push(parent)
      }
    }
  }

  return ancestors
}

const InpuTab = ({ nodeId }: { nodeId: string }) => {
  const nodeOutputs = useWorkflowStore((state) => state.nodeOutputs)
  const edges = useWorkflowStore((state) => state.edges)
  const nodes = useWorkflowStore((state) => state.nodes)

  const upstreamInputs = useMemo(() => {
    return getAllAncestorNodeIds(nodeId, edges)
      .map((ancestorId) => {
        const node = nodes.find((n) => n.id === ancestorId)
        return {
          ancestorId,
          label: (node?.data?.label as string) || (node?.data?.type as string) || ancestorId,
          output: nodeOutputs[ancestorId],
        }
      })
      .filter((item) => item.output !== undefined)
  }, [nodeId, edges, nodes, nodeOutputs])

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/60">
      <PaneHeader
        title="Input"
        description="Data from previous nodes"
        icon={<ArrowDownToLine className="size-4" />}
        badge={
          upstreamInputs.length > 0 ? (
            <Pill tone="primary">
              {upstreamInputs.length} {upstreamInputs.length === 1 ? 'node' : 'nodes'}
            </Pill>
          ) : undefined
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {upstreamInputs.length > 0 ? (
          <div className="space-y-4 p-4">
            {upstreamInputs.map(({ ancestorId, label, output }) => (
              <section
                key={ancestorId}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-xs"
              >
                <header className="flex items-center justify-between gap-2 border-b border-border bg-muted px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="truncate text-xs font-medium">{label}</span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {ancestorId.slice(0, 8)}
                  </span>
                </header>
                <JsonView data={output} className="max-h-72" />
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Workflow className="size-5" />}
            title="No input data yet"
            description="Run the nodes connected before this one and their results will show up here."
          />
        )}
      </div>
    </div>
  )
}

export default InpuTab