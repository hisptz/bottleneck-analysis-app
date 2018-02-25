import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.css']
})
export class AppContainerComponent implements OnInit {
  @Input() appUrl: string;
  @Input() height: string;
  constructor() {}

  ngOnInit() {}
}
