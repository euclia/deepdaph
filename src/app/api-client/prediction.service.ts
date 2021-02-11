import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Prediction } from '../models/prediction.model';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { DialogsService } from '../dialogs/dialogs.service';
import { Observable } from 'rxjs';
import { Config } from '../config/config';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredictionService extends BaseApiService<Prediction>{

  constructor(
    http: HttpClient,
    // public sessionServise:SessionService,
    // public dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService,
    public dialogsService:DialogsService){
        super(http, dialogsService, oidcSecurityService,  "prediction/")
    }

    public countPredictions(skip:Number, max:Number): Observable<HttpResponse<Prediction[]>>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = token;
      let headers = new HttpHeaders({'accept':'application/json'}).set('Authorization',"Bearer " + tokenValue);
      let pathFormed = Config.DeepDaphAPI + 'prediction/' 
      let params = new HttpParams();
      params = params.append('skip', skip.toString());
      params = params.append('maximum', max.toString()); 
      let options = { headers: headers, params: params ,observe:'response'};
      return this.http.get(pathFormed,{ headers: headers, params: params ,observe:'response'} ).pipe(
          tap((res : HttpResponse<Prediction[]>) => {  
            return res.headers.get('total')     
          }),catchError( err => this.dialogsService.onError(err) )
      );
    }

    public countPredictionsWithParams(skip:Number, max:Number, paramsg:HttpParams): Observable<HttpResponse<Prediction[]>>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = token;
      let headers = new HttpHeaders({'accept':'application/json'}).set('Authorization',"Bearer " + tokenValue);
      let pathFormed = Config.DeepDaphAPI + 'prediction/' 
      // let params = new HttpParams();
      // params = params.append('skip', skip.toString());
      // params = params.append('maximum', max.toString()); 
      paramsg.append('skip', skip.toString()).append('maximum', max.toString())
      let options = { headers: headers, params: paramsg ,observe:'response'};
      return this.http.get(pathFormed,{ headers: headers, params: paramsg ,observe:'response'} ).pipe(
          tap((res : HttpResponse<Prediction[]>) => {  
            return res.headers.get('total')     
          }),catchError( err => this.dialogsService.onError(err) )
      );
    }


    // public countPredictionsResp(skip:Number, max:Number): Observable<HttpResponse<Prediction[]>>{
    //   const token = this.oidcSecurityService.getToken();
    //   const tokenValue = token;
    //   let headers = new HttpHeaders({'accept':'application/json'}).set('Authorization',"Bearer " + tokenValue);
    //   let pathFormed = Config.DeepDaphAPI + 'prediction/' 
    //   let params = new HttpParams();
    //   params = params.append('skip', skip.toString());
    //   params = params.append('maximum', max.toString()); 
    //   let options = { headers: headers, params: params ,observe:'response'};
    //   return this.http.get(pathFormed,{ headers: headers, params: params ,observe:'response'} ).pipe(
    //       tap((res : HttpResponse<Prediction[]>) => {  
    //         return res     
    //       }),catchError( err => this.dialogsService.onError(err) )
    //   );
    // }

}
