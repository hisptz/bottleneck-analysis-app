import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-error-notifier',
  templateUrl: './error-notifier.component.html',
  styleUrls: ['./error-notifier.component.css']
})
export class ErrorNotifierComponent implements OnInit {

  @Input() errorMessage: string;
  constructor() { }

  ngOnInit() {
  }

}
