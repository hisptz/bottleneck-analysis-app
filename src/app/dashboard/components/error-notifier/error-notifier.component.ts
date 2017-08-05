import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-error-notifier',
  templateUrl: './error-notifier.component.html',
  styleUrls: ['./error-notifier.component.css']
})
export class ErrorNotifierComponent implements OnInit {

  @Input() errorMessage: string;
  safeErrorMessage: any;
  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() {

    this.safeErrorMessage = this._sanitizer.bypassSecurityTrustHtml(this.errorMessage);
  }

}
