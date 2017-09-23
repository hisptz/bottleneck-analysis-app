import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { DataFilterComponent } from './components/data-filter/data-filter.component';
import {MultiselectComponent} from './components/org-unit-filter/multiselect/multiselect.component';
import {FilterLevelPipe} from './pipes/filter-level.pipe';
import {OrgUnitFilterComponent} from './components/org-unit-filter/org-unit-filter.component';
import {TreeModule} from 'angular-tree-component';
import {OrgUnitService} from './components/org-unit-filter/org-unit.service';
import {FormsModule} from '@angular/forms';
import {OrderPipe} from './pipes/order-by.pipe';
import {FilterByNamePipe} from './pipes/filter-by-name.pipe';
import {Ng2PaginationModule} from 'ng2-pagination';
import {AddUnderscorePipe} from './pipes/add-underscore.pipe';
import {DndModule} from 'ng2-dnd';
import {DataService} from './providers/data.service';
import {LocalStorageService} from './providers/local-storage.service';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FuseSearchPipe} from './pipes/fuse-search.pipe';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    DragulaModule,
    Ng2PaginationModule,
    DndModule.forRoot()
  ],
  declarations: [
    LayoutComponent,
    OrgUnitFilterComponent,
    DataFilterComponent,
    MultiselectComponent,
    FilterLevelPipe,
    OrderPipe,
    FilterByNamePipe,
    AddUnderscorePipe,
    ClickOutsideDirective,
    FuseSearchPipe
  ],
  exports: [
    OrgUnitFilterComponent,
    DataFilterComponent,
    LayoutComponent
  ],
  providers: [
    OrgUnitService,
    DataService,
    LocalStorageService
  ]
})
export class DimensionsModule { }
