import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class CodeNode implements INodeDefination {
    name = "Code";
    type = "code";
    description = "Execute custom JavaScript code to transform workflow item data";
    icon = "Code";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Language",
            name: "language",
            type: "options",
            options: ["JavaScript", "Python"],
            default: "JavaScript"
        },
        {
            displayName: "Source Code",
            name: "code",
            type: "string",
            placeholder: "return items.map(item => ({ ...item.json, processed: true }));",
            default: "return items;"
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}