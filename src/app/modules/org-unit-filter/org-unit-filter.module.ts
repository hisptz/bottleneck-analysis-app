import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrgUnitFilterComponent} from './org-unit-filter.component';
import {MultiselectComponent} from './components/multiselect/multiselect.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FilterLevelPipe} from './pipes/filter-level.pipe';
import {TreeModule} from 'angular-tree-component';
import {TranslateModule} from '@ngx-translate/core';
import {OrgUnitService} from './orgunit.service-new';

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    TranslateModule,
  ],
  declarations: [
    OrgUnitFilterComponent,
    MultiselectComponent,
    ClickOutsideDirective,
    FilterLevelPipe
  ],
  exports: [OrgUnitFilterComponent],
  providers: [OrgUnitService]
})
export class OrgUnitFilterModule { }
