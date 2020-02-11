import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { components } from './components';
import { containers } from './containers';
import { LegendSetConfigurationComponent } from './legend-set-configuration.component';
import { services } from './services';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, ColorPickerModule],
  declarations: [LegendSetConfigurationComponent, ...components, ...containers],
  exports: [LegendSetConfigurationComponent, ...components, ...containers],
  providers: [...services]
})
export class LegendSetConfigurationModule {}
