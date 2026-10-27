import { Injectable, OnModuleInit } from "@nestjs/common";
import { INodeDefination } from "./interfaces/node-registry.interface";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { WORKFLOW_NODE } from "./decorators/node.decorator";


@Injectable()
export class NodeRegistry implements OnModuleInit {
  private nodes = new Map<string,INodeDefination>();

  constructor(
    private readonly discovery:DiscoveryService,
    private readonly reflector:Reflector
  ){}

  onModuleInit() {
    for (const wrapper of this.discovery.getProviders()){
      const {instance,metatype} = wrapper;
      if(!instance || !metatype) continue;


      const isNode = this.reflector.get<boolean>(WORKFLOW_NODE,metatype)

      if(isNode){
        const node = instance as INodeDefination;
        this.nodes.set(node.type,node)
      }
    }
    console.log("node",this.nodes)
    console.log(`Registered nodes: ${[...this.nodes.keys()].join(", ")}`);
  }

  get(type:string):INodeDefination{
    const node = this.nodes.get(type)

    if(!node) throw new Error("Unknown node type")

      return node
  }

  listAllNodes(){
    let node = [...this.nodes.values()]

    return node.map((n)=>({
      name:n.name,
      type:n.type,
      description:n.description,
      icon:n.icon
    }))
  }

}