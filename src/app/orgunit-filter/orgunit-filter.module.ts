import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgunitFilterComponent } from './orgunit-filter.component';
import {OrgunitService} from './providers/orgunit.service';
import {TreeModule} from 'angular-tree-component';
import {MultiselectComponent} from './components/multiselect/multiselect.component';
import {ClickOutsideDirective} from './directives/click-outside.directive';

@NgModule({
  imports: [
    CommonModule,
    TreeModule
  ],
  declarations: [OrgunitFilterComponent, MultiselectComponent, ClickOutsideDirective],
  exports: [OrgunitFilterComponent],
  providers: [OrgunitService]
})
export class OrgunitFilterModule { }
