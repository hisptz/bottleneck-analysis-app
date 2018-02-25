import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { DictionaryListComponent } from './components/dictionary-list/dictionary-list.component';
import { DictionaryItemComponent } from './components/dictionary-item/dictionary-item.component';
import {DictionaryStoreService} from './services/dictionary-store.service';
import {SharedModule} from '../../shared/shared.module';
import { DictionaryProgressComponent } from './components/dictionary-progress/dictionary-progress.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [DictionaryListComponent, DictionaryItemComponent, DictionaryProgressComponent],
  exports: [DictionaryListComponent],
  providers: [DictionaryStoreService, DatePipe]
})
export class DictionaryModule { }
