import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, throwError } from 'rxjs';
import { Config } from '../config/config';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeepdaphapiService {


  constructor(private http: HttpClient,
      public oidcSecurityService: OidcSecurityService){
  }

    
  public predictHeadsTails(file:File, save:boolean): Observable<any>{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = token;
      let headers = new HttpHeaders().set('Authorization', tokenValue);
      let pathFormed = Config.DeepDaphAPI + 'deepdaphapi/headstails/'
      let formData = new FormData();      
      formData.append('file', file.slice(0, file.size), file.name)
      formData.append('save', String(save))
      formData.append('date', Date.now().toString())
      let options = { headers: headers , responseType: 'blob' as 'json' };
      return this.http.post(pathFormed, formData, options ).pipe(
          tap((res : Blob) => {  
            return res         
          }),catchError( err => this.handleError(err) )
      );
  }

  public predictClass(file:File): Observable<any>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization', tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'deepdaphapi/class/'
    let formData = new FormData();      
    formData.append('file', file.slice(0, file.size), file.name)
    let options = { headers: headers };
    return this.http.post(pathFormed, formData, options ).pipe(
        tap((res : Response) => {  
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
    // public checkIfDoaExists(hasSources:string){
    //     const token = this.oidcSecurityService.getToken();
    //     const tokenValue = 'Bearer ' + token;
    //     let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
    //     let pathFormed = Config.JaqpotBase + this._doaBase
    //     let params = new HttpParams().set('hasSources', hasSources);
    //     return this.http.get<Response>(pathFormed, { headers: headers, params: params} )
    // }
}
