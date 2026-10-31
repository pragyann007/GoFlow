import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class SlackNode implements INodeDefination {
    name = "Slack";
    type = "slack";
    description = "Send a message or alert to a Slack channel";
    icon = "Hash";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Webhook URL",
            name: "webhookUrl",
            type: "string",
            placeholder: "https://hooks.slack.com/services/T00/B00/XXXX",
            default: ""
        },
        {
            displayName: "Channel",
            name: "channel",
            type: "string",
            placeholder: "#general",
            default: "#general"
        },
        {
            displayName: "Message",
            name: "message",
            type: "string",
            placeholder: "Workflow completed with status: {{$json.status}}",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        console.log("Slack",incomingData)
        return incomingData;

    }
}