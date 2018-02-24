import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromServices from './services';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromDirectives from './directives';
import * as fromPipes from './pipes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromDirectives.directives,
    ...fromPipes.pipes,
  ],
  exports: [...fromContainers.containers],
  providers: [fromServices.services]
})
export class MenuModule {}
