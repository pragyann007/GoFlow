import { IFNodeProperty } from "@/types/workflow";
import {z} from "zod" 

export function generateDynamicSchema(properties:IFNodeProperty[])
{
    const shape:Record<string,z.ZodTypeAny> = {  };

    for (const prop of properties){
            let validator:z.ZodTypeAny;

            switch(prop.type){
                case "string":
                    validator = z.string().nonempty("This field is required");
                    break ;
                case "number":
                    validator = z.coerce.number()
                case "boolean":
                    validator = z.boolean()
                case "options":
                    validator = prop.options && prop.options.length > 0 ? z.enum(prop.options as [string,...string[]]):z.string();
                    break;
                default:
                    validator=z.any()

            }   

            if(prop.displayOptions?.show){
                validator = validator.optional()
            }
            if(prop.default !== undefined){
                validator = validator.default(prop.default)
            }
            shape[prop.name]=validator
    }

    return z.object(shape)



}

export function generateDefaultValue (properties:IFNodeProperty[]){

    const defaults: Record<string, any> = {};

    for(const prop of properties){
        defaults[prop.name]=prop.default ?? (
            prop.type == "boolean" ? false:
            prop.type == "number" ? 0 :
            prop.type == "options" ? (prop.options?.[0] ?? ""):""
        )
    }

    return defaults 

}