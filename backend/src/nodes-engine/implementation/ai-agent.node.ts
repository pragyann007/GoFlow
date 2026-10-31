import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {ChatOpenAI} from "@langchain/openai"
import {ChatAnthropic} from "@langchain/anthropic"


const PROVIDER_MAP = {
    Google:{Cls:ChatGoogleGenerativeAI},
    OpenAI:{Cls:ChatOpenAI},
    Anthropic:{Cls:ChatAnthropic}

}

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
            options: ["Google", "OpenAI", "Anthropic"],
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
            displayName: "API Keys",
            name: "apiKeys",
            type: "string",
            placeholder:"sk.......",
            default:""
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
        const {provider,modelName,systemPrompt,temperature,jsonMode,apiKeys} = nodeParameters

        console.log("my incoming data ",incomingData)

        // const modelConfig = PROVIDER_MAP[provider];

        // const model = new modelConfig.Cls({
        //     model:modelName,
        //     apiKey:apiKeys,
        //     temperature

        // })

        // let prompt = ChatP
        // if()



        return [{ output: "AI response simulation placeholder", rawInput: incomingData }];
    }
}