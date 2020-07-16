const mongoose=require("mongoose")
const Schema=mongoose.Schema

const PatientSchema=new Schema({
    fullName:{
        type:String
    },
    phone:{
        type:Number
    }
})
PatientSchema.virtual('appointments', {
    ref: 'Appointments',
    localField: '_id',
    foreignField: 'patient',
    justOne: false // set true for one-to-one relationship
  });
const Patient=mongoose.model("Patient",PatientSchema)

module.exports=Patient