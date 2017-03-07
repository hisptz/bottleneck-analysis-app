import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dhis2MenuComponent } from './components/dhis2-menu/dhis2-menu.component';
import { FilterPipe } from './pipes/filter.pipe';
import {Ng2PaginationModule} from "ng2-pagination";
import { ProgressComponent } from './components/progress/progress.component';
import {Constants} from "./constants";
import {CurrentUserService} from "./providers/current-user.service";
import {NotificationService} from "./providers/notification.service";
import { SafePipe } from './pipes/safe.pipe';


@NgModule({
  imports: [
      CommonModule,
      Ng2PaginationModule
  ],
  declarations: [
    Dhis2MenuComponent,
    FilterPipe,
    ProgressComponent,
    SafePipe
  ],
  exports: [
    Dhis2MenuComponent,
    FilterPipe,
      Ng2PaginationModule,
      ProgressComponent,
    SafePipe
  ],
  providers: [Constants, CurrentUserService, NotificationService]
})

export class SharedModule {}
