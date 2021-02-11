import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { throwError, Observable } from 'rxjs';
import { Prediction } from '../models/prediction.model';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Config } from '../config/config';
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient,
     private oidcSecurityService:OidcSecurityService) { }

  public getPredictions(skip:Number, max:Number): Observable<Prediction[]>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'history/' 
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('max', max.toString()); 
    let options = { headers: headers, params: params };
    return this.http.get(pathFormed, options ).pipe(
        tap((res : Prediction[]) => {  
          return res       
        }),catchError( err => this.handleError(err) )
    );
  }

  public countPredictions(skip:Number, max:Number): Observable<HttpResponse<Prediction[]>>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'history/' 
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('max', max.toString()); 
    let options = { headers: headers, params: params ,observe:'response'};
    return this.http.get(pathFormed,{ headers: headers, params: params ,observe:'response'} ).pipe(
        tap((res : HttpResponse<Prediction[]>) => {  
          return res.headers.get('total')[0]     
        }),catchError( err => this.handleError(err) )
    );
  }

  public getThumbnail(thumbid:string): Observable<any>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'history/thumbnail/' + thumbid
    let options = { headers: headers , responseType: 'blob' as 'json' };
    return this.http.get(pathFormed, options ).pipe(
        tap((res : Blob) => {  
          return res         
        }),catchError( err => this.handleError(err) )
    );
  }

  public getPicture(picid:string): Observable<any>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'history/picture/' + picid
    let options = { headers: headers , responseType: 'blob' as 'json' };
    return this.http.get(pathFormed, options ).pipe(
        tap((res : Blob) => {  
          return res         
        }),catchError( err => this.handleError(err) )
    );
  }

  public deletePrediction(prediction:Prediction): Observable<any>{
    const token = this.oidcSecurityService.getToken();
    let oid = prediction._id['$oid']
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'history/' + oid
    let options = { headers: headers };
    return this.http.delete(pathFormed, options ).pipe(
        tap((res : any) => {  
          return res         
        }),catchError( err => this.handleError(err) )
    );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
      return throwError(errorMessage);
  }
}
