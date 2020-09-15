import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Duration } from 'luxon';

@Table({ tableName: 'meetings' })
export default class StyleMeeting extends Model<StyleMeeting> {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    source: string;

    @Column({ type: DataType.INTEGER })
    sourceService: int;

    @Column({ type: DataType.STRING, defaultValue: '' })
    location: string;

    @Column({ type: DataType.STRING, defaultValue: '' })
    locationDescription: string;

    @Column({ type: DataType.JSON, defaultValue: [] })
    formats: Array<string>;

    @Column({ type: DataType.STRING, allowNull: false })
    start: string;

    @Column({ type: DataType.STRING, allowNull: false })
    duration: string;

    @Column({ type: DataType.STRING, defaultValue: 'GMT' })
    timezone: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    weekday: int;
}