import { Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export default class StyleUser extends Model<StyleUser> {
    @PrimaryKey
    @Column({ type: DataType.STRING })
    id: string;

    @Column({ type: DataType.STRING(12) })
    name: string;

    @Column({ type: DataType.TINYINT })
    tracking: number;

    @Column({ type: DataType.TEXT })
    skills: string;

    @Column({ type: DataType.TEXT })
    daily: string;
}