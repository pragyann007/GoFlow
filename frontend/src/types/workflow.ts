// The lightweight object sent to populate the sidebar quickly
export interface IFNodeProperty{
    displayName:string
    name:string
    type:"string"|"number"|"boolean"|"options"
    default:any
    options?:string[]
    placeholder?:string,
    displayOptions?: {
        show?: {
            [fieldName: string]: any[]; // e.g. { method: ['POST', 'PUT'] }
        };
    };
}

export interface ISidebarNodeSummary {
    name:string
    type:string
    description:string
    icon:string
    inputs:number
    outputs:number
    properties:IFNodeProperty[]
}
