import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProgressLoaderComponent} from './components/progress-loader/progress-loader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProgressLoaderComponent],
  exports: [ProgressLoaderComponent]
})
export class SharedModule { }
