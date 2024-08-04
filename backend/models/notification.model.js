import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" ,
        required : true 
    } ,
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" ,
        required : true
    },
    type : {
        type : String,
        enum : ["follow","like","unfollow","unlike","comment"] ,
        required : true
    },
    read  : {
        type : Boolean,
        default : false
    }
},{timestamps: true})

const notifications = mongoose.model('notifications',notificationSchema) ;

export default notifications ;  