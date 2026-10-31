// workflow.module.ts
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { NodeRegistry } from "./node.registry.service";
import { HttpRequestNode } from "./implementation/http-request.node";
import { WebHookNode } from "./implementation/webhook.node";
import { AiAgentNode } from "./implementation/ai-agent.node";
import { CodeNode } from "./implementation/code.node";
import { NotificationNode } from "./implementation/notification.node";
import { ScheduleTriggerNode } from "./implementation/schedule-trigger.node";
import { SwitchNode } from "./implementation/switch.node";
import { DiscordNode } from "./implementation/discord.node";
import { SlackNode } from "./implementation/slack.node";
import { GmailNode } from "./implementation/gmail.node";
import { BullModule } from "@nestjs/bullmq";
import { NodeExecuteProvider } from "./node-executor.provider";
import { AiProviderRegistry } from "./implementation/AiProviderRegistry";


@Module({
  imports: [DiscoveryModule],
  controllers: [],
  providers: [NodeRegistry,HttpRequestNode,WebHookNode,AiAgentNode,CodeNode,NotificationNode,ScheduleTriggerNode,SwitchNode ,DiscordNode,SlackNode,GmailNode,NodeExecuteProvider,AiProviderRegistry/*, ...more nodes */],
  exports:[NodeRegistry,NodeExecuteProvider]
})
export class NodeModule {}