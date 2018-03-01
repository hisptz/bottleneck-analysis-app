import { Component, Input, OnInit } from '@angular/core';
import { MessageConversation } from '../../models/message-conversation';

@Component({
  selector: 'app-message-conversation-item',
  templateUrl: './message-conversation-item.component.html',
  styleUrls: ['./message-conversation-item.component.css']
})
export class MessageConversationItemComponent implements OnInit {
  @Input() messageConversation: MessageConversation;
  constructor() { }

  ngOnInit() {


  }


}
