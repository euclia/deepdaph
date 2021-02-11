import { Component, OnInit, Input } from '@angular/core';
import { DeepdaphapiService } from '../api-client/deepdaphapi.service';

@Component({
  selector: 'app-processed-image',
  templateUrl: './processed-image.component.html',
  styleUrls: ['./processed-image.component.css']
})
export class ProcessedImageComponent implements OnInit {

  @Input() processedImage: Blob;
  @Input() filename:string;

  imageURL


  running=false
  res:any
  DAMAGED:Boolean


  constructor(
    private _deepDaphApi:DeepdaphapiService
  ) { }

  ngOnInit() {
    var reader = new FileReader();
    reader.readAsDataURL(this.processedImage); 
    reader.onload = (_event) => { 
      this.imageURL = reader.result; 
    }
  }

  startPrediction(){
    var b: any = this.processedImage;
    b.lastModifiedDate = new Date();
    // console.log(this.filename)
    b.name = this.filename.split(".")[0] + '_forprediction.jpeg';
    // b.name = "temp"
    let file = <File>b;
    this.running = true;
    this._deepDaphApi.predictClass(file).subscribe(res =>{
      this.res =JSON.stringify(res)
      this.running = false;
      if(res['Class'] === 'Damaged'){
        this.DAMAGED = true;
      }
      else{
        this.DAMAGED = false;
      }
    })
  }


}
