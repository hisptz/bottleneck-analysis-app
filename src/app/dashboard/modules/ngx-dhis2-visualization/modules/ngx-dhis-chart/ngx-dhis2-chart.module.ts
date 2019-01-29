import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { components } from './components';

@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  exports: [...components]
})
export class NgxDhis2ChartModule {}
