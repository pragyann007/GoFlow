import { HttpException } from "@nestjs/common";
import { INodeDefination } from "../interfaces/node-registry.interface";

export const HttpRequestNode:INodeDefination = {
    name:"HTTP Request",
    type:"http-request-node",
    description:"Fetch data from an external API.",
    icon:"a.jphg",
    inputs:1,
    outputs:1,
    properties:[
        {displayName:"URL",name:"url",type:"string",default:"",placeholder:"https:/goflow.io"},
        {displayName:"Method",name:"method",type:"options",default:"POST",options:["GET","POST","PUT"]}


    ],
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