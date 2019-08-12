import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { directives } from './directives';
import { pipes } from './pipes';

@NgModule({
  declarations: [...pipes, ...directives],
  exports: [
    ...pipes,
    ...directives,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule]
})
export class SharedModule {}
