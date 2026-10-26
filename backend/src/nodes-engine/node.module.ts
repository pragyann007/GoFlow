// workflow.module.ts
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { NodeRegistry } from "./node.registry.service";
import { HttpRequestNode } from "./implementation/http-request.node";
import { WebHookNode } from "./implementation/webhook.node";


@Module({
  imports: [DiscoveryModule],
  controllers: [],
  providers: [NodeRegistry, HttpRequestNode,WebHookNode /*, ...more nodes */],
  exports:[NodeRegistry]
})
export class NodeModule {}