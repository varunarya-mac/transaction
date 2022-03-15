import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  static getDateWithISOFormat(): string {
    const currentDate = new Date()
    return currentDate.toISOString().substring(0, 16);
  }

  static convertPoundsIntoPense(value: number): number {
    if(!isNaN(value)) return value * 100;
    else return 0;
  }

  static convertPenseIntoPound(value: number): number {
    if (!isNaN(value)) return Math.round(value/100);
    else return 0
  };
  
}
