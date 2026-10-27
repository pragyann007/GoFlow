import { Injectable } from "@nestjs/common";
import { INodeDefination } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class  WebHookNode implements INodeDefination{
    name="Webhook Trigger"
    type="webhook-node"
    description="Start a workflow when a HTTP call is recieved"
    icon="Webhook"
    inputs=0
    outputs=1
    properties=[
        {displayName:"Path",name:"path",type:"string" as const ,default:"/webhook"},
        {displayName:"Method",name:"method",type:"options" as const ,default:"POST",options:["GET","POST"]}


    ]
    async execute(nodeParamters,incomingData){
        return incomingData

    }
}