
const express=require('express');
const app=express();
const cors=require('cors')
const mongoose=require('mongoose')

require("dotenv").config()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://toxa_k_9:zxcv123580@cluster0-k5f2o.mongodb.net/Dental?retryWrites=true&w=majority',
{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:true,useCreateIndex:true})
.then(()=>console.log("DB CONNECTED"))
.catch(err=>{
    console.log(`DB CONNECTION ERROR :${err.message}`)
})


const port =process.env.PORT||5000

app.listen(port,()=>console.log(`Server started on: ${port}`))

const patientsRouter=require("./routes/PatientRouter")
app.use('/patients',patientsRouter)


const appointmentsRouter=require("./routes/AppointmentsRouter")
app.use('/appointments',appointmentsRouter)