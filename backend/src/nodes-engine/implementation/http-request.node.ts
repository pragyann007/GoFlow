import { Injectable } from "@nestjs/common";
import { INodeDefination, INodeProperty } from "../interfaces/node-registry.interface";
import { Node } from "../decorators/node.decorator";

@Injectable()
@Node()
export class HttpRequestNode implements INodeDefination {
    name = "HTTP Request";
    type = "httpRequest";
    description = "Make an HTTP request to any API endpoint";
    icon = "globe";
    inputs = 1;
    outputs = 1;
    
    properties: INodeProperty[] = [
        {
            displayName: "Method",
            name: "method",
            type: "options",
            options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            default: "GET"
        },
        {
            displayName: "URL",
            name: "url",
            type: "string",
            placeholder: "https://api.example.com/v1/resource",
            default: ""
        },
        {
            displayName: "Authentication",
            name: "authType",
            type: "options",
            options: ["None", "Bearer Token", "Basic Auth"],
            default: "None"
        },
        {
            displayName: "Bearer Token",
            name: "bearerToken",
            type: "string",
            placeholder: "your_api_token_here",
            default: "",
            displayOptions: {
                show: {
                    authType: ["Bearer Token"]
                }
            }
        },
        {
            displayName: "Username",
            name: "basicUser",
            type: "string",
            placeholder: "username",
            default: "",
            displayOptions: {
                show: {
                    authType: ["Basic Auth"]
                }
            }
        },
        {
            displayName: "Password",
            name: "basicPass",
            type: "string",
            placeholder: "password",
            default: "",
            displayOptions: {
                show: {
                    authType: ["Basic Auth"]
                }
            }
        },
        {
            displayName: "JSON Body",
            name: "body",
            type: "string",
            placeholder: '{"key": "value"}',
            default: "",
            displayOptions: {
                show: {
                    method: ["POST", "PUT", "PATCH"]
                }
            }
        }
    ];

    async execute(nodeParameters: any, incomingData: any[]) {
        const { url, method, authType, bearerToken, basicUser, basicPass, body } = nodeParameters;
        
        // Guard clause against empty workflow designer fields
        if (!url) {
            throw new Error("HTTP Node failed: URL parameter is empty or undefined.");
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // 1. Resolve Authorization Mechanisms
        if (authType === "Bearer Token" && bearerToken) {
            headers["Authorization"] = `Bearer ${bearerToken}`;
        } else if (authType === "Basic Auth" && basicUser && basicPass) {
            const encoded = Buffer.from(`${basicUser}:${basicPass}`).toString("base64");
            headers["Authorization"] = `Basic ${encoded}`;
        }

        try {
            const options: RequestInit = {
                method: method || "GET",
                headers,
            };

            // 2. Safely parse and attach outgoing payload body structures
            if (["POST", "PUT", "PATCH"].includes(method) && body) {
                options.body = typeof body === "string" ? body : JSON.stringify(body);
            }

            // 3. Dispatch outbound network trigger asynchronously
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Server responded with HTTP Status ${response.status}`);
            }

            const responseData = await response.json();
            
            // CRITICAL ENGINE BRIDGE: Return an engine-compliant payload structure
            return {
                data: Array.isArray(responseData) ? responseData : [responseData]
            };

        } catch (error: any) {
            throw new Error(`HTTP Node failed: ${error.message}`);
        }
    }

}