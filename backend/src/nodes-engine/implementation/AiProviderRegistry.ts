import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BadRequestException, Injectable } from "@nestjs/common";


type AIModelFactory = (modelName:string,apiKey:string,temperature:number)=>BaseChatModel
@Injectable()
export class AiProviderRegistry {

    private registry:Map<string,AIModelFactory> = new Map()
    constructor(){
        this.registerProvider()

    }


    private registerProvider(){
        this.registry.set("Google",(modelName,apiKey,temperature)=>{
            return new ChatGoogleGenerativeAI({
                model:modelName || "gemini-2.5-flash",
                apiKey,
                temperature:temperature ?? 0.7

            })
        })

        this.registry.set('OpenAI', (modelName, apiKey, temperature) => {
            return new ChatOpenAI({
                modelName: modelName || 'gpt-4o',
                openAIApiKey: apiKey,
                temperature: temperature ?? 0.7,
            });
        });

        this.registry.set('Anthropic', (modelName, apiKey, temperature) => {
            return new ChatAnthropic({
                model: modelName || 'claude-3-5-sonnet-20241022',
                anthropicApiKey: apiKey,
                temperature: temperature ?? 0.7,
            });
        });    }


    public getModel(provider:string,modelName:string,apiKey:string,temperature:number):BaseChatModel{
        const factory = this.registry.get(provider)

        if(!factory){
            throw new BadRequestException(`Unsupported AI provider: ${provider} . Supported Providers are ${Array.from(this.registry.keys()).join("")} `)
        }

        return factory(modelName,apiKey,temperature)
    }
}