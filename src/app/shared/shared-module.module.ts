import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dhis2MenuComponent } from './components/dhis2-menu/dhis2-menu.component';
import { FilterPipe } from './pipes/filter.pipe';
import {DropdownModule, ModalModule} from "ng2-bootstrap";
import {Ng2PaginationModule} from "ng2-pagination";


@NgModule({
  imports: [
      CommonModule,
      DropdownModule,
      ModalModule,
      Ng2PaginationModule
  ],
  declarations: [
    Dhis2MenuComponent,
    FilterPipe
  ],
  exports: [
      DropdownModule,
      ModalModule,
    Dhis2MenuComponent,
    FilterPipe,
      Ng2PaginationModule
  ],
  providers: []
})

export class SharedModule {}
