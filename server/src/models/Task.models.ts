import { Table, Model, Column, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User.model";

enum Importance {
    URGENTE = "URGENTE",
    ALTA = "ALTA",
    MEDIA = "MEDIA",
    BAJA = "BAJA"
}

@Table({
    timestamps: true,
    tableName: 'tasks',
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
        type: DataType.DATE,
        allowNull: false,
    })
    date!: Date;
    
    @Column({
        type: DataType.ENUM(...Object.values(Importance)),
        allowNull: false,
        defaultValue: Importance.MEDIA
    })
    importance!: Importance;
    
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    userId!: string;

    @BelongsTo(() => User)
    user!: User;
}
