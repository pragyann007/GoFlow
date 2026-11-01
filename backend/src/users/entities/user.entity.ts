import { AuthType } from "src/authentication/enums/auth-provider.enum";
import { Workflows } from "src/workflows/entities/workflow.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: false })
    firstName: string;

    @Column({ type: "text", nullable: false })
    lastName: string;

    @Column({ type: "enum", enum: AuthType, nullable: false, default: AuthType.LOCALE })
    provider: AuthType;

    @Column({ type: "text", nullable: false })
    email: string;

    @Column({ type: "text", nullable: true })
    password?: string;

    @CreateDateColumn()
    createdAt: Date;

    // Fixed spelling from `worflows` to `workflows` and point to the `user` property in Workflows
    @OneToMany(() => Workflows, (workflow) => workflow.user)
    workflows: Workflows[];
}