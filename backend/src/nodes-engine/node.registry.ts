import { INodeDefination } from "./interfaces/node-registry.interface";
import { WebHookNode } from "./implementation/webhook.node";
import { HttpRequestNode } from "./implementation/http-request.node";


export class NodeRegistry {
    private static registry = new Map<string,INodeDefination>();

    static{
        this.register(WebHookNode);
        this.register(HttpRequestNode)
    }

  private static register(node:INodeDefination){
    this.registry.set(node.type,node)
  }

  static getAllBluePrints(){
    return Array.from(this.registry.values()).map(({execute,...metadata})=>metadata)

  }

  static getExecutionLogic(type:string):INodeDefination|undefined{
    return this.registry.get(type)
  }
}