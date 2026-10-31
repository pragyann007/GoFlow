import { Injectable } from "@nestjs/common";
import { Workflows } from "src/workflows/entities/workflow.entity";
import { NodeRegistry } from "./node.registry.service";
import * as _ from "lodash"
import { match } from "assert";
import { da } from "zod/v4/locales";

@Injectable()
export class NodeExecuteProvider {

    constructor(private readonly nodeRegistryService: NodeRegistry) { }

    public resolvedParameters(parameters: Record<string, any>, incomingData: any[]): Record<string, any> {
        const resolvedParams = _.cloneDeep(parameters)

        const replaceExpression = (value: any): any => {
            if (typeof value == "string") {
                return value.replace(/\{\{(.*?)\}\}/g, (match, path) => {
                    const trimmedPath = path.trim()
                    for (const dataItem of incomingData) {
                        const targetdObj = Array.isArray(dataItem) ? dataItem[0] : dataItem;

                        if (targetdObj) {
                            const val = _.get(targetdObj, trimmedPath)

                            if (val != undefined && val != null) {
                                return typeof val == "object" ? JSON.stringify(val) : val
                            }
                        }
                    }
                    return match

                })
            }
            else if (typeof value == "object" && value != null) {

                for (const key of Object.keys(value)) {
                    value[key] = replaceExpression(value[key])
                }

            }
            return value
        }
        return replaceExpression(resolvedParams)

    }

    /**
     * Parses edges to validate DAG safety and extract structural dependencies.
     * Returns a flat array of nodes sorted topologically AND an explicit map of parents.
     */


    private buildGraphStructure(edges: Record<string, any>[]): { order: string[]; dependencies: Record<string, string[]> } {
        const adjacencyList = new Map<string, string[]>();
        const inDegree = new Map<string, number>();

        const dependencies: Record<string, string[]> = {};
        const uniqueIds = new Set<string>();

        for (const edge of edges) {
            uniqueIds.add(edge.source);
            uniqueIds.add(edge.target);
        }

        for (const id of uniqueIds) {
            adjacencyList.set(id, []);
            inDegree.set(id, 0);
            dependencies[id] = [];
        }

        for (const { source, target } of edges) {
            adjacencyList.get(source)!.push(target);
            inDegree.set(target, (inDegree.get(target) || 0) + 1);
            dependencies[target].push(source);
        }

        const queue: string[] = [];
        for (const id of uniqueIds) {
            if (inDegree.get(id) === 0) {
                queue.push(id);
            }
        }

        const order: string[] = [];

        while (queue.length > 0) {
            const current = queue.shift()!;
            order.push(current);

            const neighbors = adjacencyList.get(current) || [];
            for (const neighbor of neighbors) {
                const nextInDegree = inDegree.get(neighbor)! - 1;
                inDegree.set(neighbor, nextInDegree);

                if (nextInDegree === 0) {
                    queue.push(neighbor);
                }
            }
        }

        if (order.length !== uniqueIds.size) {
            throw new Error("Cycle detected! The workflow graph is not a valid Directed Acyclic Graph (DAG).");
        }

        return { order, dependencies };
    }

    private emitSocketUpdate(executionId: string, nodeName: string, status: string, data?: any) {
        console.log(`[Socket] Execution: ${executionId} | Node: ${nodeName} -> ${status}`, data ?? '');
    }

    /**
     * Executes the matching node definition class from your dynamic NestJS service registry.
     */
    async executeActualNodeLogic(
        nodeType: string,
        parameterValues: Record<string, any>,
        incomingData: any[]
    ): Promise<{
        data: any;
        isIfNode?: boolean;
        conditionPassed?: boolean;
        trueBranchTarget?: string;
        falseBranchTarget?: string;
    }> {
        const node = this.nodeRegistryService.get(nodeType);
        if (!node) {
            throw new Error(`Node type "${nodeType}" is not registered in NodeRegistry.`);
        }

        const result = await node.execute(parameterValues, incomingData);

        // FIX: Extract routing fields directly if the target node is an IF condition splitter
        return {
            data: result.data || result, // keeps your output predictable
            isIfNode: result.isIfNode,
            conditionPassed: result.conditionPassed,
            trueBranchTarget: result.trueBranchTarget,
            falseBranchTarget: result.falseBranchTarget
        };
    }


    // Helper to find all upstream ancestor IDs for a given node from your graph edges
    private getAllAncestorIds(nodeId: string, edges: any[]): string[] {
        const parentMap = new Map<string, string[]>();
        for (const edge of edges) {
            if (!parentMap.has(edge.target)) {
                parentMap.set(edge.target, []);
            }
            parentMap.get(edge.target)!.push(edge.source);
        }

        const visited = new Set<string>();
        const queue: string[] = [nodeId];
        const ancestors: string[] = [];

        while (queue.length > 0) {
            const current = queue.shift()!;
            const directParents = parentMap.get(current) || [];

            for (const parent of directParents) {
                if (!visited.has(parent)) {
                    visited.add(parent);
                    ancestors.push(parent);
                    queue.push(parent);
                }
            }
        }
        return ancestors;
    }
    /**
     * Integrates Kahn's structural analysis with your concurrent async step execution engine.
     */
    /**
   * Integrates Kahn's structural analysis with your concurrent async step execution engine.
   */
    async executor(workflow: Workflows) {

        // Safety verification in case the workflow layout is entirely empty
        if (!workflow.nodes || workflow.nodes.length === 0) {
            console.log("No nodes present in the workflow execution target.");
            return;
        }

        const edges = workflow.connections?.edges || [];
        const executionId = `exec_${Date.now()}`;

        // =================================================================
        // YOUR FALLBACK LOGIC: If there are no edges, execute the standalone node directly!
        // =================================================================
        if (edges.length === 0) {
            console.log("No edges detected on canvas. Running your fallback standalone execution logic...");
            try {
                const standaloneNode = workflow.nodes[0];
                const nodeType = standaloneNode.data.type;
                const parametricType = standaloneNode.data.values || {};

                this.emitSocketUpdate(executionId, standaloneNode.id, "RUNNING");

                const result = await this.executeActualNodeLogic(nodeType, parametricType, []);

                this.emitSocketUpdate(executionId, standaloneNode.id, "COMPLETED", result.data);
                console.log("Standalone Execution Result:", result);
                return; // Stop here since there are no paths to traverse
            } catch (error: any) {
                console.error("Standalone Fallback Execution Failed:", error);
                this.emitSocketUpdate(executionId, workflow.nodes[0].id, "FAILED", error.message);
                return;
            }
        }

        // =================================================================
        // PARALLEL ENGINE: Runs when there are connections/edges on the canvas
        // =================================================================
        try {
            const { order, dependencies } = this.buildGraphStructure(edges);

            // Handle floating layout nodes alongside connected components
            for (const node of workflow.nodes) {
                if (!dependencies[node.id]) {
                    dependencies[node.id] = [];
                    order.push(node.id);
                }
            }

            const completedNodes = new Set<string>();
            const skippedNodes = new Set<string>();
            const executingNodes = new Set<string>();
            const nodeOutputs: Record<string, any> = {};

            const isReadyToExecute = (nodeName: string): boolean => {
                const parents = dependencies[nodeName] || [];
                return parents.every(parent => completedNodes.has(parent) || skippedNodes.has(parent));
            };

            const processNode = async (nodeName: string): Promise<void> => {
                if (completedNodes.has(nodeName) || skippedNodes.has(nodeName)) return;

                if (skippedNodes.has(nodeName)) {
                    const children = order.filter(child => (dependencies[child] || []).includes(nodeName));
                    for (const child of children) {
                        skippedNodes.add(child);
                    }
                    this.emitSocketUpdate(executionId, nodeName, "SKIPPED");
                    await checkAndTriggerNextTasks();
                    return;
                }

                this.emitSocketUpdate(executionId, nodeName, "RUNNING");

                try {
                    const targetNodeConfig = workflow.nodes.find(d => d.id === nodeName);
                    if (!targetNodeConfig) {
                        throw new Error(`Configuration parameters not found for node ID: ${nodeName}`);
                    }

                    const nodeType = targetNodeConfig.data.type;
                    const rawparameterValues = targetNodeConfig.data.values || {};

                    // console.log('PARAMETER VALUE LOOKUP:', parameterValues, 'Node ID:', nodeName, 'Type:', nodeType);

                    // Inside your executor function:
                    const ancestorIds = this.getAllAncestorIds(nodeName, workflow.connections.edges);

                    // Collect outputs from ALL upstream nodes (HTTP Request, AI Agent, etc.)
                    const incomingData = ancestorIds.map(ancestorId => nodeOutputs[ancestorId]).filter(Boolean); const parameterValues = this.resolvedParameters(rawparameterValues, incomingData)

                    const result = await this.executeActualNodeLogic(nodeType, parameterValues, incomingData);

                    nodeOutputs[nodeName] = result.data;
                    completedNodes.add(nodeName);

                    this.emitSocketUpdate(executionId, nodeName, "COMPLETED", result.data);

                    if (result.isIfNode) {
                        const deadBranchTarget = result.conditionPassed ? result.falseBranchTarget : result.trueBranchTarget;
                        if (deadBranchTarget) skippedNodes.add(deadBranchTarget);
                    }

                } catch (error: any) {
                    this.emitSocketUpdate(executionId, nodeName, "FAILED", error.message);
                    return;
                } finally {
                    executingNodes.delete(nodeName);
                }

                await checkAndTriggerNextTasks();
            };

            const checkAndTriggerNextTasks = async (): Promise<void> => {
                const nextTasks: Promise<void>[] = [];
                for (const node of order) {
                    if (!completedNodes.has(node) && !skippedNodes.has(node) && !executingNodes.has(node) && isReadyToExecute(node)) {
                        executingNodes.add(node);
                        nextTasks.push(processNode(node));
                    }
                }
                await Promise.all(nextTasks);
            };

            const rootNodes = order.filter(node => (dependencies[node] || []).length === 0);
            if (rootNodes.length === 0 && order.length > 0) {
                throw new Error("No execution root nodes identified in graph topology.");
            }

            rootNodes.forEach(root => executingNodes.add(root));
            await Promise.all(rootNodes.map(root => processNode(root)));


        } catch (error) {
            console.error("Critical Runtime Engine Exception:", error);
        }
    }

}
