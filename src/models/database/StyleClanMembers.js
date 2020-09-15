import { Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'clanmembers' })
export default class StyleClanMembers extends Model<StyleClanMembers> {
    @PrimaryKey
    @Column({ type: DataType.STRING(12) })
    name: string;
}