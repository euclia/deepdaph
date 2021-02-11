import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Prediction } from '../models/prediction.model';
import { HistoryService } from '../api-client/history.service';
import { PredictionService } from '../api-client/prediction.service';
import { HttpParams } from '@angular/common/http';
import { ImageService } from '../api-client/image.service';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PageEvent, MatPaginator } from '@angular/material';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class HistoryComponent implements OnInit {

  

  predictions:Prediction[] = []
  total
  pageSize = 10;
  pageSizeOptions: number[] = [10];
  loading:boolean

  inputactualphoto:string;
  processedimage:string;
  showingpred:Prediction
  pred:Prediction

  checked_control:boolean = false;
  checked_exp:boolean = false;
  exposed_at
  age_inp
  _generation

  to_d
  from_d

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private historyService:HistoryService,
    private _predictionSer:PredictionService,
    private _imageService:ImageService
  ) { }

  ngOnInit() {
    if(this.paginator){
      this.paginator.pageIndex = 0
    }
    this.predictions = []
    this.loading = true;
    this._predictionSer.countPredictions(0, 1).subscribe(res =>{
      // console.log(res)
      this.total = Number(res.headers.get('total'))

      console.log(this.total)
    })
    // this.predictions
    let params = new HttpParams().set('skip', "0").set("maximum", "10")
    this._predictionSer.getList(params).subscribe((preds:Array<string>)=>{
      if(preds){
        preds.forEach((pred:string)=>{
          let _pred:Prediction =JSON.parse(pred)
          this._imageService.getImageBlob(_pred.imageId, "t")
          .pipe(
            tap((res : Blob) => {  
              return res         
            })
            ,catchError( err => this.handleError(err) )
          )
          .subscribe(b =>{
            if(b){
              var reader = new FileReader();
              reader.readAsDataURL(b); 
              reader.onload = (_event) => { 
                _pred.inputthumbphoto = reader.result; 
              this.predictions.push(_pred)
              }
            }
          })
        })
      }
    })

  }

  exposed(event){
    console.log(event)
  }

  //   this.historyService.getPredictions(0, 20).subscribe(res =>{
  //     res.forEach((r:Prediction)=>{
  //       this.historyService.getThumbnail(r..split('/')[1]).subscribe(b =>{
  //         var reader = new FileReader();
  //         reader.readAsDataURL(b); 
  //         reader.onload = (_event) => { 
  //           r.inputthumbphoto = reader.result.toString(); 
  //         }
  //         this.predictions.push(r)
  //       })
  //     })
  //   })
  //   this.loading = false;
    
  // }

  viewPred(pred:Prediction){
    this.pred = pred
  }


  pageEvent(event:PageEvent){
    // console.log(this.to_d)
    // console.log(this.from_d)
    // console.log(this.checked_control)
    // console.log(this.age_inp)
    // console.log(this.checked_exp)
    // console.log(this.exposed_at)
    // console.log(this._generation)
    let skip = event.pageIndex * 10
    let params = new HttpParams().set('skip', skip.toString()).set("maximum", "10")
    .set('control', String(this.checked_control)).set('exposed', String(this.checked_exp)).set('from', btoa(this.from_d) )
    .set('to', btoa(this.to_d)).set('age', this.age_inp).set('generation', this._generation).set('exposedAt', this.exposed_at)
    this.predictions = []
    this.loading = true;
    this._predictionSer.countPredictionsWithParams(0, 1, params).subscribe(res =>{
      this.total = Number(res.headers.get('total'))
    })
    this._predictionSer.getList(params).subscribe((preds:Array<string>)=>{
      if(preds){
        preds.forEach((pred:string)=>{
          let _pred:Prediction =JSON.parse(pred)
          this._imageService.getImageBlob(_pred.imageId, "t")
          .pipe(
            tap((res : Blob) => {  
              return res         
            })
            ,catchError( err => this.handleError(err) )
          )
          .subscribe(b =>{
            if(b){
              var reader = new FileReader();
              reader.readAsDataURL(b); 
              reader.onload = (_event) => { 
                _pred.inputthumbphoto = reader.result; 
              this.predictions.push(_pred)
              }
            }
          })
        })
      }
    })
  }


  execute(){
    // let skip = event.pageIndex * 10
    this.pred = {}
    if(this.paginator){
      this.paginator.pageIndex = 0
    }
    let params = new HttpParams().set('skip', "0").set("maximum", "10")
    .set('control', String(this.checked_control)).set('exposed', String(this.checked_exp)).set('from', btoa(this.from_d))
    .set('to', btoa(this.to_d)).set('age', this.age_inp).set('generation', this._generation).set('exposedAt', this.exposed_at)
    this.predictions = []
    this.loading = true;
    this._predictionSer.countPredictionsWithParams(0, 1, params).subscribe(res =>{
      this.total = Number(res.headers.get('total'))
      console.log(this.total)
    })
    this._predictionSer.getList(params).subscribe((preds:Array<string>)=>{
      if(preds){
        preds.forEach((pred:string)=>{
          let _pred:Prediction =JSON.parse(pred)
          this._imageService.getImageBlob(_pred.imageId, "t")
          .pipe(
            tap((res : Blob) => {  
              return res         
            })
            ,catchError( err => this.handleError(err) )
          )
          .subscribe(b =>{
            if(b){
              var reader = new FileReader();
              reader.readAsDataURL(b); 
              reader.onload = (_event) => { 
                _pred.inputthumbphoto = reader.result; 
              this.predictions.push(_pred)
              }
            }
          })
        })
      }

    })
  }

  clear(){
    this.pred = {}
    this.to_d = undefined
    this.from_d = undefined
    this.checked_control = undefined
    this.age_inp = undefined
    this.checked_exp = undefined
    this.exposed_at = undefined
    this._generation = undefined
    this.ngOnInit()
  }

  // getPredictions(){
  //   let params = new HttpParams().set('skip', "0").set("maximum", "10")

  // }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
      return throwError(errorMessage);
  }

  // downloadProcessedimage(showingpred:Prediction) {
  //   var link = document.createElement("a");
  //   link.download = showingpred.forpredphoto.split("/")[1];
  //   link.href = this.processedimage;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  // deletePred(pred){
  //   this.historyService.deletePrediction(pred).subscribe(res =>{
  //     this.ngOnInit()
  //   })
  // }

}

