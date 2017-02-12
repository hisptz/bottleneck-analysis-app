import {Injectable} from "@angular/core";
@Injectable()
export class Constants {
  public root_url: string;
  public api: string;
  constructor() {
    this.root_url = '../../../';
    this.api = this.root_url + 'api/';
  }
}
