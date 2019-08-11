import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pipes } from './pipes';
import { directives } from './directives';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [...pipes, ...directives],
  exports: [...pipes, ...directives, MatButtonModule, MatIconModule],
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class SharedModule {}
