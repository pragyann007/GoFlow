import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class GmailNode implements INodeDefination {
    name = "Gmail";
    type = "gmail";
    description = "Send an email via Gmail API or SMTP credentials";
    icon = "Mail";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Recipient Email",
            name: "to",
            type: "string",
            placeholder: "recipient@example.com",
            default: ""
        },
        {
            displayName: "Subject",
            name: "subject",
            type: "string",
            placeholder: "Alert: Workflow Execution Report",
            default: ""
        },
        {
            displayName: "Email Body",
            name: "body",
            type: "string",
            placeholder: "Hello, your automated task finished running successfully.",
            default: ""
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}