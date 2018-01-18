import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingFilterComponent } from './sharing-filter.component';
import {SharingService} from './services/sharing.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SharingFilterComponent],
  exports: [SharingFilterComponent],
  providers: [SharingService]
})
export class SharingFilterModule { }
