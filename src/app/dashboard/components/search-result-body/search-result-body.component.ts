import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-search-result-body',
  templateUrl: './search-result-body.component.html',
  styleUrls: ['./search-result-body.component.css']
})
export class SearchResultBodyComponent implements OnInit {

  @Input() searchResult: any;
  resultOptions: Array<any>;
  constructor() { }

  ngOnInit() {
  }

}
