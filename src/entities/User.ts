import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsNumber } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @Column()
  @IsNotEmpty({ message: "Last name is required" })
  lastName!: string;

  @Column()
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @Column()
  @IsNumber({}, { message: "Age must be a number" })
  age!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
