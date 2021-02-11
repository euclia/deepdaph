import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { DialogsService } from '../dialogs/dialogs.service';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseApiService<Task>{

  constructor(
    http: HttpClient,
    // public sessionServise:SessionService,
    // public dialogsService:DialogsService,
    public oidcSecurityService: OidcSecurityService,
    public dialogsService:DialogsService){
        super(http, dialogsService, oidcSecurityService,  "task/")
    }
}
