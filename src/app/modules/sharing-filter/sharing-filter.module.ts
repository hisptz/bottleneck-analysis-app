import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingFilterComponent } from './sharing-filter.component';
import { SharingService } from './services/sharing.service';
import { LimitPipe } from './pipes/limit.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SharingFilterComponent, LimitPipe, FilterByNamePipe],
  exports: [SharingFilterComponent],
  providers: [SharingService]
})
export class SharingFilterModule {}
