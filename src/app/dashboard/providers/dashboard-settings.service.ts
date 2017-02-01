import { Injectable } from '@angular/core';
import {isBoolean} from "util";

@Injectable()
export class DashboardSettingsService {

  settingItem: string;
  constructor() {
    this.settingItem = ''
  }

  toggleItem(itemName: string): void {
    if(this.settingItem == itemName) {
      this.settingItem = '';
    } else {
      this.settingItem = itemName;
    }
  }

  isOpen(itemName: string): boolean {
    let isOpen: boolean = false;

    if(this.settingItem == itemName) isOpen = true;
    return isOpen;
  }

}
