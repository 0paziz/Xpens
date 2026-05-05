const mongoose= require("mongoose");

//define the schema
const UserSchema= new mongoose.Schema({
    name: {
        type:String,
        required:true
     },
    email: {
        type:String,
        required:true , 
        unique:true},
    password:{
        type:String, 
        required:true
    },
    budgets: [{
        type: {
            type: String,
            enum: ["weekly", "monthly", "yearly"],
            required: true
        },
        category: {
            type: String,
            enum: ["food", "transportation", "entertainment", "utilities", "healthcare", "shopping", "education", "travel", "other"],
            required: true
        },
        limit: {
            type: Number,
            required: true,
            min: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt:{
        type:Date, 
        default:Date.now}
    
},{timestamps:true});


//set the model and export
const User= mongoose.model("User",UserSchema);
module.exports= User;