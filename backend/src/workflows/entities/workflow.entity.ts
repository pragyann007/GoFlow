import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { WorkflowExecution } from "./workflow-executions.entity"
import { User } from "src/users/entities/user.entity"

@Entity()
export class Workflows {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 300, nullable: false })
    name: string

    @Column({ type: "boolean", default: false })
    active: boolean

    @Column({ type: "jsonb", nullable: true, default: [] })
    nodes: any[]

    @Column({ type: "jsonb", nullable: true, default: {} })
    connections: Record<string, any>

    @Column({ type: "uuid" })
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date

    // Fixed: Point to the property on the User entity and map the foreign key column
    @ManyToOne(() => User, (user) => user.workflows, { onDelete: "CASCADE" })
    user: User

    // Fixed: Point to the relation property (`workflow`) in WorkflowExecution, not the raw column name
    @OneToMany(() => WorkflowExecution, (workflowExecution) => workflowExecution.workflow, { onDelete: "CASCADE" })
    workflowExecutions: WorkflowExecution[]
}