import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pipes } from './pipes';

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  imports: [CommonModule]
})
export class SharedModule {}
