import { INodeDefination } from "../interfaces/node-registry.interface";

export const WebHookNode:INodeDefination={
    name:"Webhook Trigger",
    type:"webhook-node",
    description:"Start a workflow when a HTTP call is recieved",
    icon:"a.jphg",
    inputs:0,
    outputs:1,
    properties:[
        {displayName:"Path",name:"path",type:"string",default:"/webhook"},
        {displayName:"Method",name:"method",type:"options",default:"POST",options:["GET","POST"]}


    ],
    async execute(nodeParamters,incomingData){
        return incomingData

    }
}