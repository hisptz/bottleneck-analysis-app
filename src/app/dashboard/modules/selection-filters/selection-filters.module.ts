import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SelectionFilterDialogComponent } from './components/selection-filter-dialog/selection-filter-dialog.component';
import { SelectionFiltersComponent } from './containers/selection-filters/selection-filters.component';
import { filterModules } from './modules';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedModule,
    ...filterModules,
  ],
  entryComponents: [SelectionFilterDialogComponent],
  declarations: [SelectionFiltersComponent, SelectionFilterDialogComponent],
  exports: [SelectionFiltersComponent],
})
export class SelectionFiltersModule {}
