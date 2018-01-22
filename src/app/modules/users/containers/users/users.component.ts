import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @Input() userList: any[];
  tableList: any[];
  constructor() {
    this.tableList = [];
  }

  ngOnInit() {
    if (this.userList) {
      this.tableList = [
        {
          id: 'user_title',
          items: [
            {
              value: 'Users',
              style: { 'font-weight': 'bold', 'text-align': 'center' },
              colSpan: 2
            }
          ]
        },
        {
          id: 'user_headers',
          items: [
            { value: '#', style: { 'font-weight': 'bold' } },
            { value: 'Name', style: { 'font-weight': 'bold' } }
          ]
        },
        ..._.map(
          this.userList,
          (userListItem: any, userListItemIndex: number) => {
            const itemKeys: any[] = _.filter(
              _.keys(userListItem),
              (key: string) => key !== 'id'
            );

            return {
              id: userListItem.id,
              items: [
                {
                  value: userListItemIndex + 1
                },
                ..._.map(itemKeys, (key: string) => {
                  return {
                    value: userListItem[key]
                  };
                })
              ]
            };
          }
        )
      ];
      console.log(this.tableList);
    }
  }
}
