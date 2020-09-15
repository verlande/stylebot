import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, ForeignKey } from 'sequelize-typescript';
import { Validate, ValidatorConstraint, ValidatorConstraintInterface, Equals, ValidateNested, IsString, IsBoolean, IsArray, IsNotEmpty, IsNotEmptyObject, IsInstance, ArrayUnique } from 'class-validator';
import StyleServer from 'models/database/StyleServer';
import { isValidTimezone } from 'util/date';

@ValidatorConstraint()
class IsValidTimezone implements ValidatorConstraintInterface {

    validate(tz: string) {
        return isValidTimezone(tz);
    }

}

@ValidatorConstraint()
class IsValidJoinType implements ValidatorConstraintInterface {
    validate(type: string) {
        type = type.toLowerCase();
        return type === 'dm' || type === 'server';
    }
}

// class MeetingSettings {
//     @IsString()
//     source: String = '';
//
//     @IsBoolean()
//     reminders: Boolean = false;
//
//     @IsString()
//     remindersChannel: String = '';
// }

class AdminSettings {
    @IsString()
    botChannel: string = '';

    @IsString()
    joinLeaveChannel: string = '';

    @IsString()
    joinMessage: string = '';

    @IsString()
    leaveMessage: string = '';

    @IsString()
    joinType: string = 'guild';

    @IsString()
    pingsChannel: string = '';
}

// class JftCronSettings {
//
//     @IsBoolean()
//     enabled: Boolean = false;
//
//     @IsArray()
//     @ArrayUnique()
//     channels: Array<string> = [];
//
//     @IsString()
//     time: String = '';
//
// }

export class ServerSettings {
    @IsString()
    @Validate(IsValidTimezone, { message: "Invalid Timezone" })
    timezone: String = 'GMT';

    @ValidateNested()
    @IsNotEmptyObject()
    @IsInstance(AdminSettings)
    admin: AdminSettings = new AdminSettings();

    // @ValidateNested()
    // @IsNotEmptyObject()
    // @IsInstance(JftCronSettings)
    // jftCron: JftCronSettings = new JftCronSettings();

    // @ValidateNested()
    // @IsNotEmptyObject()
    // @IsInstance(MeetingSettings)
    // meeting: MeetingSettings = new MeetingSettings();
}

@Table({ tableName: 'servers_settings' })
export default class StyleServerSettings extends Model<StyleServerSettings> {

    @PrimaryKey
    @ForeignKey(() => StyleServer)
    @Column({ type: DataType.STRING, allowNull: false })
    id: String;

    @Column({ type: DataType.JSON, defaultValue: new ServerSettings() })
    settings: String;

}
