import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { Config } from '../config/config';
import { tap, catchError } from 'rxjs/operators';
import { Image } from '../models/image.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { BaseApiService } from './base-api.service';


@Injectable({
  providedIn: 'root'
})
export class ImageService extends BaseApiService<Image> {

  path = "image/"

  constructor(
    http: HttpClient,
    // public sessionServise:SessionService,
    // public dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService,
    public dialogsService:DialogsService){
        super(http, dialogsService, oidcSecurityService,  "image/")

    }


  public saveImage(file:File, control:string, exposed:string, exposedAt:string, age:string, generation:string, mm:string, pixels:string): Observable<Image>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let headers = new HttpHeaders().set('Authorization','Bearer ' + tokenValue);
    let pathFormed = Config.DeepDaphAPI + 'image/'
    let formData = new FormData();      
    formData.append('file', file.slice(0, file.size), file.name)
    formData.append('control', control)
    formData.append('exposed', exposed)
    formData.append('exposedAt', exposedAt)
    formData.append('age', age)
    formData.append('generation', generation)
    formData.append('mm', mm)
    formData.append('pixels', pixels)
    let options = { headers: headers };
    return this.http.post(pathFormed, formData, options ).pipe(
        tap((res : Response) => {  
          return res         
        }),catchError( err => this.dialogsService.onError(err) )
    );
  }


  public getImageBlob(id:string, th:string): Observable<any>{
    const token = this.oidcSecurityService.getToken();
    const tokenValue = token;
    let pathFormed = Config.DeepDaphAPI + 'image/'
    let headers = new HttpHeaders().set('Authorization','Bearer ' + tokenValue).set('accept','application/octet-stream');
    // let pathFormed = Config.DeepDaphAPI + 'deepdaphapi/headstails/'
    if(th === null){
      let params = new HttpParams().set('id', id);
      let options = { headers: headers ,params:params, responseType: 'blob' as 'json' };
      return this.http.get(pathFormed, options).pipe(
          tap((res : Blob) => {  
            // console.log(res)
            return res         
          })
          // ,catchError( err => this.dialogsService.onError(err) )
      );
    }else{
      const token = this.oidcSecurityService.getToken();
      const tokenValue = token;
      let pathFormed = Config.DeepDaphAPI + 'image/'
      let headers = new HttpHeaders().set('Authorization','Bearer ' + tokenValue).set('accept','application/octet-stream');
      let params = new HttpParams().set('id', id).set('thumbnail', th);
      let options = { headers: headers ,params:params, responseType: 'blob' as 'json' };
      return this.http.get(pathFormed, options)
      // .pipe(
      //     tap((res : Blob) => {  
      //       // console.log(res)
      //       return res         
      //     })
      //     // ,catchError( err => this.dialogsService.onError(err) )
      // );
    }
          

}

}
