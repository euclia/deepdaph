import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthModule, OidcSecurityService, AuthWellKnownEndpoints, OidcConfigService, OpenIDImplicitFlowConfiguration } from 'angular-auth-oidc-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatToolbarModule, MatTooltipModule, MatSidenavModule, MatListModule, MatDividerModule, MatSlideToggleModule, MatProgressSpinnerModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule} from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import 'hammerjs';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { ProcessedImageComponent } from './processed-image/processed-image.component';
import { HistoryComponent } from './history/history.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { FormsModule } from '@angular/forms';
import { PredictionComponent } from './prediction/prediction.component';
import { configf } from './models/config.model';
import { Config } from './config/config';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    
    DragDropComponent,
    ProcessedImageComponent,
    HistoryComponent,
    ErrorDialogComponent,
    PredictionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,MatPaginatorModule, MatCheckboxModule,MatDatepickerModule,MatNativeDateModule, MatCardModule,MatDialogModule, MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule,
    MatSidenavModule,MatListModule, MatSelectModule, MatFormFieldModule,FormsModule, MatInputModule, MatDividerModule, MatSlideToggleModule, MatProgressSpinnerModule,
    AuthModule.forRoot(),
    RouterModule
    .forRoot([{path: "", component:AppComponent},
    {path:"dashboard", component:DashboardComponent},{path:'history', component:HistoryComponent}])
    ],
    providers: [
    OidcSecurityService
    ],entryComponents: [ErrorDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    // private oidcConfigService: OidcConfigService
    public oidcSecurityService: OidcSecurityService,
    private _http:HttpClient
  ){
    
    this._http.get("/conf/conf.json").subscribe((cfj:configf)=>{
      Config.DeepDaphAPI = cfj.deepdaphapi
      let openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
    
      openIDImplicitFlowConfiguration.stsServer = cfj.stsServer;
      openIDImplicitFlowConfiguration.redirect_url = cfj.redirect_url;
      // openIDImplicitFlowConfiguration.redirect_url = 'https://app.jaqpot.org/home';
      openIDImplicitFlowConfiguration.client_id = cfj.client_id;
      openIDImplicitFlowConfiguration.response_type = cfj.response_type;
      openIDImplicitFlowConfiguration.scope = 'openid email profile';
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = cfj.stsServer + '/Unauthorized';
      openIDImplicitFlowConfiguration.start_checksession = false;
      openIDImplicitFlowConfiguration.silent_renew = true;
      openIDImplicitFlowConfiguration.silent_redirect_url = cfj.baseurl + "/assets/silent-renew.html";
      openIDImplicitFlowConfiguration.silent_renew_offset_in_seconds = 20;
      openIDImplicitFlowConfiguration.post_login_route = '/dashboard';
      openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
      openIDImplicitFlowConfiguration.unauthorized_route = '/';
      openIDImplicitFlowConfiguration.auto_userinfo = true;
      openIDImplicitFlowConfiguration.log_console_warning_active = true;
      openIDImplicitFlowConfiguration.log_console_debug_active = false;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 60;
      // openIDImplicitFlowConfiguration.override_well_known_configuration = false;
      // openIDImplicitFlowConfiguration.override_well_known_configuration_url = 'http://147.102.86.129:30008/auth/realms/Jaqpan/.well-known/openid-configuration';
      openIDImplicitFlowConfiguration.storage = localStorage;
            
      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.issuer = cfj.stsServer; 
      authWellKnownEndpoints.jwks_uri = cfj.stsServer + '/protocol/openid-connect/certs';
      authWellKnownEndpoints.authorization_endpoint = cfj.stsServer + '/protocol/openid-connect/auth';
      authWellKnownEndpoints.token_endpoint = cfj.stsServer + '/protocol/openid-connect/token';
      authWellKnownEndpoints.userinfo_endpoint = cfj.stsServer +  '/protocol/openid-connect/userinfo';
      authWellKnownEndpoints.end_session_endpoint = cfj.stsServer + '/protocol/openid-connect/logout';
      authWellKnownEndpoints.check_session_iframe = cfj.stsServer + '/protocol/openid-connect/login-status-iframe.html';
      // authWellKnownEndpoints.revocation_endpoint = 'http://147.102.86.129:30008/auth/realms/Jaqpan/.well-known/openid-configuration/revocation';
      authWellKnownEndpoints.introspection_endpoint = cfj.stsServer + '/protocol/openid-connect/token/introspect';
      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    })

  //   const config: OpenIdConfiguration = {
  //     stsServer: 'https://login.jaqpot.org/auth/realms/jaqpot',
  //     redirect_url: 'http://localhost:4200/dashboard',
  //     // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
  //     // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
  //     client_id: 'deepdaph-app',
  //     response_type: 'code', // 'id_token token' Implicit Flow
  //     // response_type: 'id_token token',
  //     scope: 'openid',
  //     post_logout_redirect_uri: 'http://localhost:4200/',
  //     start_checksession: true,
  //     silent_renew: true,
  //     silent_renew_url: 'http://localhost:4200/assets/silent-renew.html',
  //     post_login_route: '/dashboard',
  //     forbidden_route: '/Forbidden',
  //     // HTTP 401
  //     unauthorized_route: '/',
  //     log_console_warning_active: true,
  //     log_console_debug_active: true,
  //     // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
  //     // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
  //     max_id_token_iat_offset_allowed_in_seconds: 100,
  //     storage: localStorage
  // };

  // const authWellKnownEndpoints: AuthWellKnownEndpoints = {
  //     issuer: 'https://login.jaqpot.org/auth/realms/jaqpot',
  //     authorization_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/auth',
  //     jwks_uri: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/certs',
  //     token_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/auth',
  //     userinfo_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/userinfo',
  //     end_session_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/logout',
  //     check_session_iframe: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/checksession',
  //     revocation_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/revocation',
  //     introspection_endpoint: 'https://login.jaqpot.org/auth/realms/jaqpot/protocol/openid-connect/introspect',
  // };

  //   this.oidcSecurityService.setupModule(config, authWellKnownEndpoints);
  }
}



// sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --ignore-preflight-errors=NumCPU
// kubectl apply -f https://docs.projectcalico.org/v3.11/manifests/calico.yaml

// kubectl create namespace ingress-nginx
// helm repo add stable https://kubernetes-charts.storage.googleapis.com/


// apiVersion: extensions/v1beta1
// kind: Ingress
// metadata:
//   name: kuard
//   annotations:
//     kubernetes.io/ingress.class: "nginx"    
//     cert-manager.io/issuer: "letsencrypt-staging"

// spec:
//   tls:
//   - hosts:
//     - example.example.com
//     secretName: quickstart-example-tls
//   rules:
//   - host: example.example.com
//     http:
//       paths:
//       - path: /
//         backend:
//           serviceName: kuard
//           servicePort: 80


// data:
//   proxy-buffer-size: "128k"
//   proxy-buffers: "4 256k"
//   proxy-busy-buffers-size: "256k"
//   client-header-buffer-size: "64k"
//   http2-max-field-size: "16k"
//   http2-max-header-size: "128k"
//   large-client-header-buffers: "8 64k"


