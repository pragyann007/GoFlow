import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class ScheduleTriggerNode implements INodeDefination {
    name = "Schedule Trigger";
    type = "schedule";
    description = "Trigger workflows periodically using interval or cron expressions";
    icon = "Clock";
    inputs = 0;
    outputs = 1;

    properties: INodeProperty[] = [
        {
            displayName: "Trigger Interval",
            name: "interval",
            type: "options",
            options: ["Every Minute", "Every Hour", "Every Day", "Custom Cron"],
            default: "Every Hour"
        },
        {
            displayName: "Cron Expression",
            name: "cronExpression",
            type: "string",
            placeholder: "0 0 * * *",
            default: "0 * * * *",
            displayOptions: {
                show: {
                    interval: ["Custom Cron"]
                }
            }
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        return incomingData;
    }
}