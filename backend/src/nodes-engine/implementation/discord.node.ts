import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class DiscordNode implements INodeDefination {
    name = "Discord";
    type = "discord";
    description = "Send rich embeds or messages to a Discord channel via Webhook";
    icon = "MessageSquare";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Webhook URL",
            name: "webhookUrl",
            type: "string",
            placeholder: "https://discord.com/api/webhooks/...",
            default: ""
        },
        {
            displayName: "Bot Username",
            name: "username",
            type: "string",
            placeholder: "Automation Bot",
            default: "GoFlow Bot"
        },
        {
            displayName: "Message Content",
            name: "content",
            type: "string",
            placeholder: "Task execution finished!",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}