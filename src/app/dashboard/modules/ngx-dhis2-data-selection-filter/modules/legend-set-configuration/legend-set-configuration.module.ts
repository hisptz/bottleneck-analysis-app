import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpModule } from '@angular/http';
import { components } from './components';
import { containers } from './containers';
import { LegendSetConfigurationComponent } from './legend-set-configuration.component';
import { services } from './services';

@NgModule({
  imports: [CommonModule, FormsModule, HttpModule, ColorPickerModule],
  declarations: [LegendSetConfigurationComponent, ...components, ...containers],
  exports: [LegendSetConfigurationComponent, ...components, ...containers],
  providers: [...services]
})
export class LegendSetConfigurationModule {}
