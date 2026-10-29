import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class AiAgentNode implements INodeDefination {
    name = "AI Agent";
    type = "aiAgent";
    description = "Process text or data using an LLM with custom system instructions";
    icon = "Bot";
    inputs = 1;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Model Provider",
            name: "provider",
            type: "options",
            options: ["Google Gemini", "OpenAI", "Anthropic Claude"],
            default: "Google Gemini"
        },
        {
            displayName: "Model Name",
            name: "modelName",
            type: "options",
            options: ["gemini-2.5-flash", "gemini-2.5-pro", "gpt-4o", "claude-3-5-sonnet"],
            default: "gemini-2.5-flash"
        },
        {
            displayName: "System Prompt",
            name: "systemPrompt",
            type: "string",
            placeholder: "You are a helpful data extraction assistant...",
            default: "You are a helpful assistant."
        },
        {
            displayName: "Temperature",
            name: "temperature",
            type: "number",
            placeholder: "0.7",
            default: 0.7
        },
        {
            displayName: "Enable JSON Mode",
            name: "jsonMode",
            type: "boolean",
            default: false
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        // Metadata / placeholder execution stub
        return [{ output: "AI response simulation placeholder", rawInput: incomingData }];
    }
}