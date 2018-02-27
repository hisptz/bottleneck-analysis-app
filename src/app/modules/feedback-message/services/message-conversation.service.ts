import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/http-client.service';
import { Observable } from 'rxjs/Observable';
import { MessageConversation } from '../models/message-conversation';
import { map } from 'rxjs/operators';

@Injectable()
export class MessageConversationService {
  constructor(private httpClient: HttpClientService) {
  }

  loadAll(): Observable<MessageConversation[]> {
    return this.httpClient.get(
      'messageConversations.json?fields=id,name,displayName,href,read,created,lastUpdated,followUp,subject,messageType,' +
      'lastMessage,priority,status,lastSender[id,name],user[id,name],messages[id,created,lastUpdated,name,displayName,text,' +
      'sender[id,name]]&paging=false').pipe(map((res) => res.messageConversations));
  }
}
