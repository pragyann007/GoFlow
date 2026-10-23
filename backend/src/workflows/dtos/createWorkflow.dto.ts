import { IsString } from "class-validator";

export class CreateWorkflowDTO {
    @IsString()
    name:string

}