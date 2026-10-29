import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class WebHookNode implements INodeDefination {
    name = "Webhook Trigger";
    type = "webhook";
    description = "Triggers the workflow when an incoming HTTP request hits your endpoint";
    icon = "Webhook";
    inputs = 0;
    outputs = 1;
    
    properties: INodeProperty[] = [
        {
            displayName: "Path",
            name: "path",
            type: "string",
            placeholder: "/webhook/my-custom-endpoint",
            default: "/webhook"
        },
        {
            displayName: "HTTP Method",
            name: "method",
            type: "options",
            options: ["GET", "POST", "PUT", "DELETE"],
            default: "POST"
        },
        {
            displayName: "Response Mode",
            name: "responseMode",
            type: "options",
            options: ["Immediately", "When Last Node Finishes"],
            default: "When Last Node Finishes"
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}