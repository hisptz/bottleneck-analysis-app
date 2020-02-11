import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodFilterComponent } from './period-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PeriodFilterComponent],
  exports: [PeriodFilterComponent],
  providers: []
})
export class PeriodFilterModule {}
