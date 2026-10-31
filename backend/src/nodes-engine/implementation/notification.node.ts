import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class NotificationNode implements INodeDefination {
    name = "Send Notification";
    type = "notifications";
    description = "Send alerts via Slack webhooks or SMTP Email";
    icon = "Bell";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Notification Channel",
            name: "channel",
            type: "options",
            options: ["Slack", "Discord", "Email"],
            default: "Slack"
        },
        {
            displayName: "Webhook URL",
            name: "webhookUrl",
            type: "string",
            placeholder: "https://hooks.slack.com/services/...",
            default: "",
            displayOptions: {
                show: {
                    channel: ["Slack", "Discord"]
                }
            }
        },
        {
            displayName: "Recipient Email",
            name: "email",
            type: "string",
            placeholder: "admin@example.com",
            default: "",
            displayOptions: {
                show: {
                    channel: ["Email"]
                }
            }
        },
        {
            displayName: "Message Body",
            name: "message",
            type: "string",
            placeholder: "Workflow completed successfully with data: {{$json}}",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        console.log("NOtiffication",incomingData)
        return incomingData;
    }
}