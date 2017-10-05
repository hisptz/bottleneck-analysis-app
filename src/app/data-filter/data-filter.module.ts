import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterComponent } from './data-filter.component';
import {ClickOutsideDirective} from './click-outside.directive';
import {FormsModule} from '@angular/forms';
import {FilterByNamePipe} from './pipes/filter-by-name.pipe';
import {OrderPipe} from './pipes/order-by.pipe';
import {Ng2PaginationModule} from 'ng2-pagination';
import {AddUnderscorePipe} from './pipes/add-underscore.pipe';
import {DragulaModule} from 'ng2-dragula';
import {DndModule} from 'ng2-dnd';
import {DataFilterService} from './services/data-filter.service';
import {LocalStorageService} from './services/local-storage.service';
import {FuseSearchPipe} from './pipes/fuse-search.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    Ng2PaginationModule,
    DndModule.forRoot()
  ],
  declarations: [
    DataFilterComponent,
    ClickOutsideDirective,
    FilterByNamePipe,
    OrderPipe,
    AddUnderscorePipe,
    FuseSearchPipe
  ],
  exports: [DataFilterComponent],
  providers: [
    DataFilterService,
    LocalStorageService
  ]
})
export class DataFilterModule { }
