import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Prediction } from '../models/prediction.model';
import { ImageService } from '../api-client/image.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnChanges {
  
  @Input() prediction:Prediction


  abdomenPhotoId
  abdomenPhoto
  heartPhotoId
  heartPhoto
  measurementsPhotoId
  measurementsPhoto

  constructor(
    private _imageApi:ImageService
  ) { }

  ngOnChanges() {
    // console.log(this.prediction)
    if(this.prediction){
      if(this.prediction.abdomenPhotoId){
        if(typeof this.abdomenPhoto === 'undefined' || this.abdomenPhotoId != this.prediction.abdomenPhotoId){
          this._imageApi.getImageBlob(this.prediction.abdomenPhotoId, null).subscribe(im=>{
                var reader = new FileReader();
                reader.readAsDataURL(im); 
                reader.onload = (_event) => { 
                this.abdomenPhoto = reader.result; 
                this.abdomenPhotoId = this.prediction.abdomenPhotoId
              }
          })
        }
      }else{
        this.abdomenPhoto = null
      }
      if(this.prediction.heartPhotoId){
        if(typeof this.heartPhoto === 'undefined' || this.heartPhotoId != this.prediction.heartPhotoId){
          this._imageApi.getImageBlob(this.prediction.heartPhotoId, null).subscribe(im=>{
                var reader = new FileReader();
                reader.readAsDataURL(im); 
                reader.onload = (_event) => { 
                this.heartPhoto = reader.result; 
                this.heartPhotoId = this.prediction.heartPhotoId
              }
          })
        }
      }else{
        this.heartPhoto = null
      }
      if(this.prediction.measurementsPhotoId){
        if(typeof this.measurementsPhoto === 'undefined'|| this.measurementsPhotoId != this.prediction.measurementsPhotoId){
          this._imageApi.getImageBlob(this.prediction.measurementsPhotoId, null).subscribe(im=>{
                var reader = new FileReader();
                reader.readAsDataURL(im); 
                reader.onload = (_event) => { 
                this.measurementsPhoto = reader.result; 
                this.measurementsPhotoId = this.prediction.measurementsPhotoId
              }
          })
        }
      }else{
        this.measurementsPhoto = null
      }
    }
    
  }

}
