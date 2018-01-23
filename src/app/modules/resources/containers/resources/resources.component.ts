import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  @Input() resourceList: any[];
  tableList: any[];
  constructor() {
    this.tableList = [];
  }

  ngOnInit() {
    if (this.resourceList) {
      this.tableList = [
        {
          id: 'resources_title',
          items: [
            {
              value: 'Resources',
              style: {
                'font-weight': 'bold',
                'text-align': 'center',
                'background-color': '#eee'
              },
              colSpan: 2
            }
          ]
        },
        {
          id: 'resoources_headers',
          items: [
            {
              value: '#',
              style: {
                'font-weight': 'bold',
                width: '5%',
                'background-color': '#eee'
              }
            },
            { value: 'Name', style: { 'font-weight': 'bold' } }
          ]
        },
        ..._.map(
          this.resourceList,
          (resourceListItem: any, resourceListItemIndex: number) => {
            const itemKeys: any[] = _.filter(
              _.keys(resourceListItem),
              (key: string) => key !== 'id'
            );

            return {
              id: resourceListItem.id,
              items: [
                {
                  value: resourceListItemIndex + 1,
                  style: { width: '5%', 'background-color': '#eee' }
                },
                ..._.map(itemKeys, (key: string) => {
                  return { value: resourceListItem[key] };
                })
              ]
            };
          }
        )
      ];
    }
  }
}
