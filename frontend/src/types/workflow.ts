import type { Edge, Node as XYNode } from "@xyflow/react"

// The lightweight object sent to populate the sidebar quickly
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

// 👇 NEW: This safely wraps the real values matching what the user typed in the form
export type NodeParameterValues = Record<string, any>;

// 👇 NEW: Extend your node schema to support static blueprints AND live user parameter entries
export interface IWorkflowNodeData extends ISidebarNodeSummary {
    values?: NodeParameterValues; 
    status?: "IDLE" | "RUNNING" | "COMPLETED" | "FAILED" | "SKIPPED";
    error?: string;
}

// 👇 NEW: Strongly type the actual nodes structure sitting inside your Zustand canvas state
export interface ICanvasNode extends XYNode {
    type: string; // Typically "custom"
    data: IWorkflowNodeData;
}

// Your unified core creation payload contract
export interface IWorkflowCreation {
    id: string
    name: string
    active: boolean
    // 👇 FIX: Changed from 'node' (singular) to 'nodes' (plural) matching your normalization function array
    nodes: ICanvasNode[] 
    connections: {
        edges: Edge[]
    }
}
