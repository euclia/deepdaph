import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'deepdaph';
  isAuthenticated: boolean;
  userData: any;

  constructor(public oidcSecurityService: OidcSecurityService,
    public router:Router) {
    if (this.oidcSecurityService.moduleSetup) {
        this.doCallbackLogicIfRequired();
    } else {
        this.oidcSecurityService.onModuleSetup.subscribe(() => {
            this.doCallbackLogicIfRequired();
        });
    }
  }

  ngOnInit() {
    this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
        this.isAuthenticated = auth;
        if(this.isAuthenticated === true){
          this.router.navigate(['/dashboard'])          
        }
    });

    this.oidcSecurityService.getUserData().subscribe(userData => {
        this.userData = userData;
    });
  }

  login(){
    // console.log(this.oidcSecurityService.moduleSetup)
    this.oidcSecurityService.authorize()
    // this.oidcSecurityService.authorizedImplicitFlowCallback() //.authorize()
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  goToDashboard(){
    this.router.navigate(['/dashboard'])
  }

  goToHistory(){
    this.router.navigate(['/history'])
  }

  private doCallbackLogicIfRequired() {
    // Will do a callback, if the url has a code and state parameter.
    // this.oidcSecurityService.authorizedImplicitFlowCallback()
    // const urlParts = window.location.toString().split('?');
    // const params = new HttpParams({
    //     fromString: urlParts[1]
    // });
    // const code = params.get('code');
    // const state = params.get('state');
    // const session_state = params.get('session_state');

    // if (code && state && session_state) {
    //     this.oidcSecurityService.requestTokensWithCode(code, state, session_state);
    // }
    if (window.location.hash) {
      this.oidcSecurityService.authorizedCallback();
    }
    // this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
  }

}
