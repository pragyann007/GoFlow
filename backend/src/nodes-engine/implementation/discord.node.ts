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
        console.log("Discord incoming data:", incomingData);
        const { webhookUrl, username, content } = nodeParameters;

        if (!webhookUrl) {
            throw new Error("No webhook URL provided for Discord node.");
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    username: username || "GoFlow Bot",
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Discord API error: ${response.status} - ${errorText}`);
            }

            // Discord webhooks return a 204 No Content status on success
            const responseData = response.status === 204 ? { status: "OK" } : await response.json();

            return {
                data: [{ success: true, response: responseData }]
            };

        } catch (error: any) {
            console.error("Discord node execution failed:", error);
            throw new Error(`Discord execution failed: ${error.message}`);
        }
    }
}