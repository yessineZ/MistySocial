import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    text : {
        type : String,
    },
    img : {
        type : String,
        default : ""
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    comments : [{
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        text : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now
        }
    },]  
},{timestamps : true}) ;

const Post = mongoose.model('Post', PostSchema) ; 

export default Post ;  // this will be used in other files to access Post model.