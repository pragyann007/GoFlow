import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class SwitchNode implements INodeDefination {
    name = "Switch";
    type = "switch";
    description = "Route workflow execution to different outputs based on conditions";
    icon = "GraphHub";
    inputs = 1;
    outputs = 3; // Supports multiple output paths

    properties: INodeProperty[] = [
        {
            displayName: "Condition 1 (Expression)",
            name: "condition1",
            type: "string",
            placeholder: "e.g. status === 'success' or userId == 1",
            default: ""
        },
        {
            displayName: "True Branch Target Node ID",
            name: "trueBranchTarget",
            type: "string",
            placeholder: "Target node ID if condition matches",
            default: ""
        },
        {
            displayName: "False Branch Target Node ID",
            name: "falseBranchTarget",
            type: "string",
            placeholder: "Target node ID if condition fails",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {

        const {condition1,trueBranchTarget,falseBranchTarget} = nodeParameters

        console.log("Switch Node evaluating condition:", condition1, "with incoming data:", incomingData);        

        let conditionPassed = false

        if(condition1 && incomingData.length > 0){
            try {
                const targetedObj = Array.isArray(incomingData[0]) ? incomingData[0][0] : incomingData[0];
                
                const evaluate = new Function('$json', `try { return !!(${condition1}); } catch(e) { return false; }`);

                conditionPassed = evaluate(targetedObj);

                
            } catch (err) {
                console.error("Switch node condition evaluation error:", err);
                conditionPassed = false;    
                
            }


        }
        console.log(`Switch condition result: ${conditionPassed}`);

        return {
            data: [{ conditionPassed, evaluatedAt: Date.now() }],
            isIfNode: true,
            conditionPassed,
            trueBranchTarget: trueBranchTarget || undefined,
            falseBranchTarget: falseBranchTarget || undefined
        };


    }
}