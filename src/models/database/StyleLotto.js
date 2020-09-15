import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'lotto' })
export default class StyleLotto extends Model<StyleLotto> {
    @PrimaryKey
    @Column({ type: DataType.STRING(12) })
    name: string;

}