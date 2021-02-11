export interface Prediction{
    _id?:any;
    imageId?:string;
    // userid?:string;
    date?:Number
    measurementsPhotoId?:string;
    tailLength?:Number,
    totalLength?:Number
    abdomenPhotoId?:string;
    heartPhotoId?:string;
    abdomen5?:Array<Number>;
    abdomen3?:Array<Number>;
    heart3?:Array<Number>;
    inputthumbphoto?:any;
}


// 'photoId': fields.String(required=True, description='photo id'),
// 'date': fields.Integer(description='Date of the prediction'),
// 'control': fields.String( description='Control or not'),
// 'exposed': fields.String( description='Exposed or not'),
// 'exposedAt': fields.String(description='Exposed at of exposed'),
// 'age': fields.String(description='Age of Daphnia'),
// 'generation': fields.String(description='Generation of daphnia'),
// 'mm': fields.String(description='The μΜ of the scale per pixels'),
// 'pixels': fields.String(description='The pixels of the scale'),
// 'measurementsPhotoId': fields.String(description='Image id of the image with measurements rendered'),
// 'abdomenPhotoId':fields.String(desription='Image id of the abdomen'),
// 'heartPhotoId' :fields.String(desription='Image id of the heart'),
// 'abdomen5':fields.Arbitrary(desription='5 class prediction of the lipids in abdomen'),
// 'abdomen3':fields.Arbitrary(desription='3 class prediction of the lipids in abdomen'),
// 'heart3':fields.Arbitrary(desription='3 class prediction of the lipids in heart')