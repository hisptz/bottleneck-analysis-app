import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-favorite-settings',
  templateUrl: './favorite-settings.component.html',
  styleUrls: ['./favorite-settings.component.css']
})
export class FavoriteSettingsComponent implements OnInit {

  favoriteOptions: any[] = [{}];
  @Input() visualizationType: string;
  @Input() visualizationSettings: any[];
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  activeSetting: string;
  constructor() {

  }

  ngOnInit() {
    if (this.visualizationSettings) {
      this.activeSetting = this.visualizationSettings[0].id;
    }
    console.log(JSON.stringify(this.visualizationSettings))
  }


  addOption() {
    this.favoriteOptions.push({})
  }

  removeOption(index) {
    this.favoriteOptions.splice(index, 1)
  }

  close() {
    this.onClose.emit(true)
  }

  updateFavoriteOptions() {
    console.log(this.mapToPlainObject(this.favoriteOptions))
  }

  mapToPlainObject(favoriteOptions) {
    const favoriteOptionObject: any = {};
    if (favoriteOptions) {
      favoriteOptions.forEach(option => {
        favoriteOptionObject[option.key] = option.value;
      })
    }
    return favoriteOptionObject
  }

}
