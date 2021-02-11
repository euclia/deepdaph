export interface Task{
    _id?:any;
    id?:object;
    taskId?:string;
    date?:Number;
    precentage?:Number;
    comments?:Array<string>
    predictionId?:any
    error?:string
    finishedWithError?:boolean
    finished?:boolean
}