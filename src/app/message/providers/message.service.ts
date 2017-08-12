import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

// importing rxjs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MessageService {
  
  constructor(private http: Http) { }
  private messageUrl = '../../../api/25/messageConversations.json?fields=:all,id,followUp,lastUpdated,userFirstname,userSurname,read,name,subject,userMessages[followUp,read,user[id,displayName]],messageType,externalAccess,lastMessage,priority,status,access,user[id,displayName],messages[id,name,displayName,text,created,lastUpdated,sender[id,name,displayName],externalAccess],userMessages[*]&pageSize=50&page=1';

  getMessages():Observable<any>{
    return this.http.get(this.messageUrl)
                    .map((res:Response)=> res.json())
                    .catch((error:any)=>Observable.throw(error.json().error || 'Server error'));
  }

}