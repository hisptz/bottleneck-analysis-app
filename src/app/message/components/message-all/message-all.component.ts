import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../providers/message.service';

@Component({
  selector: 'app-message-all',
  templateUrl: './message-all.component.html',
  styleUrls: ['./message-all.component.css']
})
export class MessageAllComponent implements OnInit {
messages:any[] = [];
  constructor(private messageService: MessageService) { }
    getAllMessages(){
        this.messageService.getMessages()
                            .subscribe(msg =>{
                              this.messages = msg.messageConversations;
                              console.log(msg);
                            },
                            error => {
                              console.log(error);
                            })
    }
  ngOnInit() {
    this.getAllMessages();
  }
}
