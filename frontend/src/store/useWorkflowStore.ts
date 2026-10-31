import { ISidebarNodeSummary } from "@/types/workflow";
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange
} from "@xyflow/react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface WorkflowState {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (nodeBlueprint: ISidebarNodeSummary) => void;
    updateNodeValues: (nodeId: string, formValues:Record<string,any>) => void;
    setNodes:(nodes:Node[])=>void ;
    setEdges:(edges:Edge[])=>void ;
    nodeOutputs:Record<string,any>;
    setNodeOutputs:(nodeId:string,output:any)=>void;


}

export const useWorkflowStore = create<WorkflowState>()(
    devtools(
        (set) => ({
            nodes: [],
            edges: [],
            nodeOutputs:{},

            onNodesChange: (changes: NodeChange[]) =>
                set((state) => ({
                    nodes: applyNodeChanges(changes, state.nodes) as Node[]
                }), false, "onNodesChange"), // Added explicit action naming for devtools

            onEdgesChange: (changes: EdgeChange[]) =>
                set((state) => ({
                    edges: applyEdgeChanges(changes, state.edges) as Edge[]
                }), false, "onEdgesChange"),

            onConnect: (connection: Connection) =>
                set((state) => ({
                    edges: addEdge(connection, state.edges)
                }), false, "onConnect"),

            addNode: (nodeBluePrint: ISidebarNodeSummary) =>
                set((state) => {
                    const offSet = state.nodes.length * 2;
                    const newNode: Node = {
                        id: crypto.randomUUID(),
                        type: "custom",
                        data: {
                            ...nodeBluePrint,
                            values: {}
                        },
                        position: {
                            x: 100 * offSet,
                            y: 100 * offSet
                        }
                    };

                    return {
                        nodes: [...state.nodes, newNode]
                    };
                }, false, "addNode"),
            updateNodeValues: (nodeId: string, formValues:Record<string,any>) => set((state) => {
                return (
                    {
                        nodes: state.nodes.map((node) => node.id == nodeId ? {...node,data:{
                            ...node.data,
                            values:{...(node.data.values || {}),...formValues}
                        }} : node)
                    }
                );
            }),
            setNodes: (nodes: Node[]) => set(() => ({
                nodes: nodes
            }), false, "setNodes"),
            
            setEdges: (edges: Edge[]) => set(() => ({
                edges: edges
            }), false, "setEdges"),
            setNodeOutputs:(nodeId:string,output:any)=>set((state)=>({
                nodeOutputs:{
                    ...state.nodeOutputs,[nodeId]:output
                }
            }))            

        })
    ),

);
