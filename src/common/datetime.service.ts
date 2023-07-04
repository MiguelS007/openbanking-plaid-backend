import { DateTime } from 'luxon';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DateTimeService {
  private readonly timezone: string;
  constructor(private readonly configService: ConfigService) {
    this.timezone = this.configService.get('timezone');
  }

  public get current() {
    return DateTime.now().setZone(this.timezone);
  }

  public formatDateToISOString(date: Date) {
    return date.toISOString();
  }

  public getFirstDayOfMonthByReference(reference) {
    return DateTime.fromObject({
      year: reference.year,
      month: reference.month.replace(/^0+/, ''),
    }).startOf('month');
  }

  public getLastDayOfMonthByReference(reference) {
    return DateTime.fromObject({
      year: reference.year,
      month: reference.month.replace(/^0+/, ''),
    }).endOf('month');
  }

  public get utc() {
    return DateTime.utc();
  }

  public convertFromUnixTimestamp(unixTimestamp: number): DateTime {
    return DateTime.fromSeconds(unixTimestamp).setZone(this.timezone);
  }

  public dateFromSubtractMonth(months: number) {
    return this.current.minus({ months }).toJSDate();
  }
}
