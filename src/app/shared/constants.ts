import {Injectable} from "@angular/core";
@Injectable()
export class Constants {
  public root_url: string;
  constructor() {
    this.root_url = '../../../';
  }
}
