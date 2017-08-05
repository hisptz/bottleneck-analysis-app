import {Injectable} from '@angular/core';

@Injectable()
export class RelativePeriodService {

  constructor() {
    this.generateCorrespondingFixedPeriodArray([]);
  }


  generateCorrespondingFixedPeriodArray(relativePeriodArray) {
    if (relativePeriodArray) {
      console.log(relativePeriodArray);
    }
  }


  private _getFixedPeriodArrayFromSingleRelativePeriod(relativePeriod: Object): Array<Object> {
    const fixedPeriods = [];
    if (relativePeriod) {

    }
    return fixedPeriods;
  }

}
