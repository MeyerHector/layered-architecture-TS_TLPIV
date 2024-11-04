import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User.model";

@Table({
  timestamps: true,
  tableName: "tasks",
})
export class Task extends Model {
  @Default(uuidv4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  completed!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @ForeignKey(() => Task)
  @BelongsTo(() => Task, {
    foreignKey: "parentId",
    onDelete: "CASCADE",
    as: "ParentTask",
  })
  parentId!: Task;

  @HasMany(() => Task, {
    foreignKey: "parentId",
    onDelete: "CASCADE",
    as: "SubTasks",
  })
  subTasks!: Task[];

  @BelongsTo(() => User)
  user!: User;
}
