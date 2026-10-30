import { IsUUID, IsString, IsBoolean, IsNotEmpty, IsObject, IsArray, IsOptional } from 'class-validator';

export class CreateWorkflowDTO {
    @IsString()
    name:string

}

// backend/src/workflows/dto/workflow.dto.ts

export class WorkflowDTO {
    @IsUUID()
    @IsOptional() // Optional because the database will generate this UUID on new creation requests
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    active: boolean;

    // We pass these as raw arrays/objects directly into Postgres jsonb slots
    @IsArray()
    @IsNotEmpty()
    nodes: any[];

    // Matches your exact console log payload mapping property key layout shape
    @IsObject()
    @IsNotEmpty()
    connections: {
        edges: any[];
    };
}



