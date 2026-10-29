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
            displayName: "Data Type to Check",
            name: "dataType",
            type: "options",
            options: ["String", "Number", "Boolean"],
            default: "String"
        },
        {
            displayName: "Value 1 (Route 1 Condition)",
            name: "condition1",
            type: "string",
            placeholder: "status === 'success'",
            default: ""
        },
        {
            displayName: "Value 2 (Route 2 Condition)",
            name: "condition2",
            type: "string",
            placeholder: "status === 'failed'",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}