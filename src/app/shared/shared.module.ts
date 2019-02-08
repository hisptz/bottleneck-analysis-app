import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pipes } from './pipes';
import { directives } from './directives';

@NgModule({
  declarations: [...pipes, ...directives],
  exports: [...pipes, ...directives],
  imports: [CommonModule]
})
export class SharedModule {}
