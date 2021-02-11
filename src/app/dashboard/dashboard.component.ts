import { Component, OnInit } from '@angular/core';
import { DeepdaphapiService } from '../api-client/deepdaphapi.service';
import { ImageService } from '../api-client/image.service';
import { Image } from '../models/image.model';
import { Prediction } from '../models/prediction.model';
import { PredictionService } from '../api-client/prediction.service';
import { Task } from '../models/task.model';
import { timer, from, Subject } from 'rxjs'
import { concatMap, map, filter, take, tap, delay } from 'rxjs/operators';
import { TaskService } from '../api-client/task.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DialogsService } from '../dialogs/dialogs.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  files: any = [];
  image:boolean = false;
  actualImage;
  imgURL: any;

  exposed = false;
  control = true;
  _generation:string;
  _mm:string;
  _pixels:string;
  _exposedAt:string 
  _age:string
  disabled = false;
  running = false;

  filename:string;

  observe: Subject<Task> = new Subject();
  taskGot:Task
  taskCompletedSuccesfully:boolean = false;

  prediction:Prediction

  constructor(
    private _deepDaphApi:DeepdaphapiService,
    private _dialogsService:DialogsService,
    private _predictionApi:PredictionService,
    private _imageApi:ImageService,
    private _taskService:TaskService,
    private _http:HttpClient
  ) {
    this.observe.subscribe((task:Task) =>{
      this.pollUntilTaskFinished2(task)      
    })

   }

  ngOnInit() {
  }
  
  uploadFile(event) {
    this.exposed = false
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.image = true;
      var reader = new FileReader();
      reader.readAsDataURL(event[0]); 
      this.filename = event[0].name
      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
      }
      this.files.push(element)
    }  
  }

  deleteAttachment(index) {
    this.image = false;
    this.files.splice(index, 1)
    this.taskGot = null
    this.prediction = null
    this.running = false;
    this.exposed = false;
    this.control = true;
    this._age = null;
    this._exposedAt = null;
    this._generation = null;
    this._mm = null;
    this._pixels = null;
    this.ngOnInit()
  }


  // startPrediction(i){
  //   let file = this.files[i]
  //   this.running = true;
  //   this._deepDaphApi.predictHeadsTails(file, this.exposed).subscribe(res =>{
  //     this.running = false;
  //     this.processedImage = res
  //   })
  // }

  saveImage(i){
    let file = this.files[i]
    this.running = true;
    this._imageApi.saveImage(file, String(this.control), String(this.exposed), this._exposedAt
      ,this._age, this._generation, this._mm, this._pixels).subscribe((res:Image) =>{
        let pred:Prediction = {}
        pred.imageId = res.imageId
        this._predictionApi.post(pred).subscribe((task:Task) =>{
          let taskN:Task = {}
          taskN._id = task.id
          this.pollUntilTaskFinished2(taskN)
        })
    })
  }

  onExposed(event){
    this.exposed = event.checked
  }

  onControl(event){
    this.control = event.checked
  }



  pollUntilTaskFinished2(task){
    if(this.observe.isStopped){
      this.observe = new Subject();
      this.observe.subscribe((task) =>{
        this.pollUntilTaskFinished2(task)      
      })
    }
    let param = new HttpParams().set('id',task._id.$oid)
    this._taskService.getOneForPoll(param).pipe(delay(1400)).subscribe((taskGot:Task)=>{
      this.taskGot = taskGot
      if (this.taskGot.finished != true){
        if(this.taskGot.predictionId != null){
          let http_param = new HttpParams().set('id', this.taskGot.predictionId.$oid)
          this._predictionApi.getOneWithParam(http_param).subscribe((pred:Prediction)=>{
            this.prediction = pred
            this.observe.next(this.taskGot);
          })
        }
      } else if(this.taskGot.finished === true){
          this.taskCompletedSuccesfully = true;
          this.taskGot = taskGot
          this.observe.unsubscribe(); 
          this.pollingFinishedFor(taskGot)
      }
    })
  }

  pollingFinishedFor(task){
    let http_param = new HttpParams().set('id', this.taskGot.predictionId.$oid)
    this._predictionApi.getOneWithParam(http_param).subscribe((pred:Prediction)=>{
      this.prediction = pred
      this.running = false;
      // this.taskGot = null
      // this.prediction = null
    })
    // console.log("Finished?")
  }

  downloadImages(){
    this._http.get("/assets/AgSS4F1noD9_5.jpg",{
      responseType : 'blob'
    }).subscribe(f=>{
      const url= window.URL.createObjectURL(f);
      var a = document.createElement("a");
      a.href = url;
      a.download = 'sample_image.jpeg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

}



