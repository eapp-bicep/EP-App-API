import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { DateTime } from 'luxon';

export class CreateSlotDto {
  @IsNotEmpty()
  @Transform(
    ({ value }) => {
      return DateTime.fromFormat(value, 'h:m').toJSDate();
    },
    { toClassOnly: true },
  )
  slotTime: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(30)
  duration: number;
}
