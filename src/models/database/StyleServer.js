import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, HasOne } from 'sequelize-typescript';
import StyleServerSettings from 'models/database/StyleServerSettings';

@Table({ tableName: 'servers' })
export default class StyleServer extends Model<StyleServer> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: String;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    enabled: Boolean;

    @Column({ type: DataType.STRING, allowNull: false })
    name: String;

    @Column({ type: DataType.DATE, allowNull: false })
    since: Date;

    @Column({ type: DataType.JSON, allowNull: false })
    owners: Array;

    @Column({ type: DataType.STRING, allowNull: false })
    region: String;

    @HasOne(() => StyleServerSettings)
    settings: StyleServerSettings;
}