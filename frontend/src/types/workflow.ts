import type { Edge, Node as XYNode } from "@xyflow/react"

export interface IFNodeProperty {
    displayName: string
    name: string
    type: "string" | "number" | "boolean" | "options"
    default: any
    options?: string[]
    placeholder?: string
    displayOptions?: {
        show?: {
            [fieldName: string]: any[]; // e.g. { method: ['POST', 'PUT'] }
        };
    };
}

export interface ISidebarNodeSummary {
    name: string
    type: string
    description: string
    icon: string
    inputs: number
    outputs: number
    properties: IFNodeProperty[]
}

export type NodeParameterValues = Record<string, any>;

export interface IWorkflowNodeData extends ISidebarNodeSummary {
    values?: NodeParameterValues; 
    status?: "IDLE" | "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED";
    error?: string;
    [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}


export interface IWorkflowCreation {
    id: string
    name: string
    active: boolean
    nodes: Node[] 
    connections: {
        edges: Edge[]
    }
}
