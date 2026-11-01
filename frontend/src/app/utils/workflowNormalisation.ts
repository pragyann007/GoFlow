import { ICanvasNode, IWorkflowCreation } from "@/types/workflow";
import { Edge, Node } from "@xyflow/react";

interface IWorkflowData {
    workflowId: string;
    workflowName: string;
}

export const normaliseWorkflow = (
    workflowData: IWorkflowData,
    nodes: Node[],
    edges: Edge[]
): IWorkflowCreation => {
    const { workflowId, workflowName } = workflowData;

    // Map React Flow nodes to your custom ICanvasNode type structure
    const normalisedNodes: ICanvasNode[] = nodes.map((node) => ({
        id: node.id,
        type: node.type || "default",
        data: (node.data as Record<string, any>) || {},
        position: node.position,
        measured: node.measured,
        selected: node.selected,
        dragging: node.dragging,
    }));

    const payload: IWorkflowCreation = {
        id: workflowId,
        name: workflowName,
        active: true,
        nodes: normalisedNodes,
        connections: {
            edges,
        },
    };

    return payload;
};