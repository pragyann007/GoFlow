import { IFNodeProperty } from "@/types/workflow";


export function shoudShowField(prop:IFNodeProperty,formValue:Record<string,any>):boolean{
    if(!prop.displayOptions?.show){
        return true 
    }

    const conditions = prop.displayOptions?.show
    return Object.entries(conditions).every(([fieldName,allowedValues])=>{
        const currentValue = formValue[fieldName];
        return allowedValues.includes(currentValue)
    })


}