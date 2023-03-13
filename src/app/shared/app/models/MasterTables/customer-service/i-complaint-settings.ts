import { FormControl } from "@angular/forms"

export interface IComplaintSettings
{
    compalintDeadLine?: FormControl<number | null>;
    reminderDays?: FormControl<number | null>;

}
export interface IComplaintSettingsData
{
    compalintDeadLine?: number,
    reminderDays?: number,

}
