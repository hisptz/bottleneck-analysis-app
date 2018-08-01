import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDhis2SelectionFiltersComponent } from './containers/ngx-dhis2-selection-filters/ngx-dhis2-selection-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { filterModules } from './modules/index';

@NgModule({
  imports: [CommonModule, TranslateModule.forChild(), ...filterModules],
  declarations: [NgxDhis2SelectionFiltersComponent],
  exports: [NgxDhis2SelectionFiltersComponent]
})
export class NgxDhis2SelectionFiltersModule {}
