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
        console.log("Slack incoming data:", incomingData);
        const { webhookUrl, channel, message } = nodeParameters;

        if (!webhookUrl) {
            throw new Error("No webhook URL provided for Slack node.");
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: channel,
                    text: message, 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Slack API error: ${response.status} - ${errorText}`);
            }

            const responseData = await response.text(); 
            
            return {
                data: [{ success: true, response: responseData }]
            };

        } catch (error: any) {
            console.error("Slack node execution failed:", error);
            throw new Error(`Slack execution failed: ${error.message}`);
        }
    }
}