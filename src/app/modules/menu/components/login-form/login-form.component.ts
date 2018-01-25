import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  credentials: any;
  loginError: string;
  constructor(private httpClient: HttpClient) {
    this.credentials = {
      username: undefined,
      password: undefined
    };
    this.loginError = '';
  }

  ngOnInit() {}

  onSubmit(e) {
    e.stopPropagation();
    this.loginError = '';

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    this.httpClient
      .post(
        '../../../dhis-web-commons-security/login.action',
        'j_username=' +
          this.credentials.username +
          '&j_password=' +
          this.credentials.password,
        {
          headers
        }
      )
      .subscribe(
        () => {
          console.log('success');
        },
        (error: HttpErrorResponse) => {
          const newError = this._handleError(error);
          if (newError.status >= 400) {
            this.loginError = 'incorrect username or password';
          }
        }
      );
  }

  private _handleError(err: HttpErrorResponse) {
    let error = null;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      error = {
        message: err.error,
        status: err.status,
        statusText: err.statusText,
        url: err.url || ''
      };
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      error = {
        message: err.error instanceof Object ? err.error.message : err.error,
        status: err.status,
        statusText: err.statusText,
        url: err.url || ''
      };
    }

    return error;
  }
}
