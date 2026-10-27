import { HttpException, Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";


@Injectable()
@Node()
export class HttpRequestNode implements INodeDefination  {
    name= "httpRequest"
    type = "action"
    description = "Make an HTTP request"
    icon = "globe"
    inputs = 1
    outputs = 1
    properties: INodeProperty[] = [
        {
            displayName: "Method",
            name: "method",
            type: "options",
            options: ["GET", "POST", "PUT", "DELETE"],
            default: "GET"
        },
        {
            displayName: "URL",
            name: "url",
            type: "string",
            placeholder: "https://api.example.com/data",
            default: ""
        },
        {
            displayName: "JSON Body",
            name: "body",
            type: "string",
            placeholder: '{"key": "value"}',
            default: "",
            displayOptions: {
                show: {
                    method: ["POST", "PUT"] // <-- Automatically hides/shows based on Method!
                }
            }
        }
    ]
    async execute(nodeParamters,incomingData){
        const {url,method} = nodeParamters;

        try {
            const response = await fetch(url,{method})
            const data = await response.json()
            return [data]

            
        } catch (error) {
            throw new Error(`HTTP Node failed : ${error.messsage}` )
            
        }

    }
   

}