
export interface INodeProperty{
    displayName:string
    name:string
    type:"string"|"number"|"boolean"|"options"
    default:any
    options?:string[]
    placeholder?:string
    displayOptions?:{
        show?:{
            [fieldName:string]:any[]
        }
    }
}

export interface INodeDefination{
    name:string
    type:string
    description:string
    icon:string
    inputs:number
    outputs:number
    properties:INodeProperty[]

    execute(nodeParamters:any,incomingData:any[]):Promise<any>;


}