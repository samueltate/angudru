import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { environment } from '../../environments/environment';
import { Token } from '../token';

import { HandleErrorService } from './handle-error.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginService {
	private mainUrl = environment.mainUrl;  // URL to web api
	private grant_type = environment.grant_type
	private client_id = environment.client_id
	private client_secret = environment.client_secret

  constructor(private http: HttpClient, private handleError: HandleErrorService, private router: Router, private route: ActivatedRoute ) { }
  
  login (user, pass): Observable<Token> {  	
  	  const url = `${this.mainUrl}oauth/token`;  
  	  let body= new FormData();  	  
  	  body.append("grant_type", this.grant_type);
  	  body.append("client_id", this.client_id);
  	  body.append("client_secret", this.client_secret);
  	  body.append("username", user);
  	  body.append("password", pass);  	  
      return this.http.post(url, body)      
      			.map((token: Token) => {      
 	  				localStorage.setItem('token', JSON.stringify(token.access_token));
	            	localStorage.setItem('refresh_token', JSON.stringify(token.refresh_token));
              		return token.access_token      				
      			})      			
            .catch(this.handleError.handleError);
  }
  
  logout() {
  	localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  	// console.log ('localstorage logout' + localStorage['token']);  
    this.router.navigate (['/login']);

    return Observable.throw("");

  }

}
