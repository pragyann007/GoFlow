import React from 'react'
import { SlidersHorizontal } from 'lucide-react'
import NodeConfigForm from './NodeConfigForm'
import InpuTab from './InpuTab'
import OutputTab from './OutputTab'
import { PaneHeader, Pill } from './PanelUi'

interface ConfigPanelProps {
  properties?: any[]
  onSubmit: (data: any) => void
  activeNodeId: string
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ activeNodeId, properties = [], onSubmit }) => {
  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 lg:grid-cols-[minmax(260px,3fr)_minmax(380px,4fr)_minmax(260px,3fr)]">
      {/* Input */}
      <aside className="hidden min-h-0 border-r border-border lg:block">
        <InpuTab nodeId={activeNodeId} />
      </aside>

      {/* Parameters – the focal column, sits on the plain background */}
      <main className="flex min-h-0 flex-col bg-background">
        <PaneHeader
          title="Parameters"
          description="Configure how this node behaves"
          icon={<SlidersHorizontal className="size-4" />}
          badge={
            properties.length > 0 ? (
              <Pill tone="muted">
                {properties.length} {properties.length === 1 ? 'field' : 'fields'}
              </Pill>
            ) : undefined
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto w-full max-w-xl">
            <NodeConfigForm properties={properties} onSubmit={onSubmit} />
          </div>
        </div>
      </main>

      {/* Output */}
      <aside className="hidden min-h-0 border-l border-border lg:block">
        <OutputTab nodeId={activeNodeId} />
      </aside>
    </div>
  )
}

export default ConfigPanel