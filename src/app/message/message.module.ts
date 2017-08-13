import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MessageAllComponent } from './components/message-all/message-all.component';
import { MessageDetailComponent } from './components/message-detail/message-detail.component';
import {MessageService} from './providers/message.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MessageComponent, MessageAllComponent, MessageDetailComponent],
  exports: [
    MessageComponent
  ],
  providers: [
   MessageService
  ]
})
export class MessageModule { }
