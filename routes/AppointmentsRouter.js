const router = require("express").Router()
const appointmentsValidation = require("../validation/appointment")
const { validationResult } = require('express-validator');
const dayjs=require('dayjs')


let Appointments = require("../models/Appointments.model");
const Patient = require("../models/Patient.model");
const sendSMS = require("../utils/sendSMS");
const {groupBy,reduce,orderBy}=require('lodash')


router.get('/', (req, res) => {
    Appointments.find().populate('patient').exec()
        .then(patients => res.status(200).json(reduce(groupBy(patients,'date'),(result,value,key)=>{
            result=[...result,{title:key,data:value}]
            return result
        },[],)))
        .catch(err => {
            res.status(500).json({
                msg: err
            })
        })
})

router.post('/', appointmentsValidation.create, async(req, res) => {
    console.log(req.body)
    const newAppointment = new Appointments({
        dentNumber: req.body.dentNumber,
        diagnosis: req.body.diagnosis,
        price: req.body.price,
        date: req.body.date,
        time: req.body.time,
        patient:req.body.patient
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
   
    const patients =await Patient.findOne({_id:req.body.patient})
    if(!patients){
        return res.status(404).json({msg:"Patient not found"})
    }
    newAppointment.save()
        .then(patient => res.status(201).json({
            patient,
            msg: "New patient successfuly added"
        }))
        .catch(err => {
            res.status(500).json({
                msg: err
            })
        })
    const delayedTime=dayjs(`${ req.body.date.split('.').reverse().join('.')}T${req.body.time}`).subtract(1,'minute').unix()
    sendSMS({
        number:patients.phone,
         text: `Добрый день ${patients.fullName}, у вам прием сегодня в ${req.body.time}`,
          time:delayedTime
    }).then(({data})=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    })
})

router.delete('/:id', async(req,res)=>{
  const id=req.params.id
  const appointment =await Appointments.findOne({_id:id})
    if(!appointment){
        return res.status(404).json({msg:"Appointmen not found"})
    }
    Appointments.deleteOne({_id:id},err=>{
      if(err){
          return res.status(404).json({msg:"Appointmen not found"})
      }else{
          return res.status(200).json({msg:"Appointmen successfuly deleted"})
      }
  })
})
router.put('/:id', async(req,res)=>{
    console.log(req.body)

    const id=req.params.id
    const appointment={
        dentNumber: req.body.dentNumber,
        diagnosis: req.body.diagnosis,
        price: req.body.price,
        date: req.body.date,
        time: req.body.time
    }
      Appointments.findOneAndUpdate({_id:id},appointment,err=>{
        if(err){
            return res.status(404).json({msg:"Appointment not found"})
        }else{
            return res.status(200).json({msg:"Appointment successfuly updated"})
        }
    })
  })


module.exports = router