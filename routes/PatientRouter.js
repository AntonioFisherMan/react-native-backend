const router = require("express").Router()
const patientValidation = require("../validation/patient")
const { validationResult } = require('express-validator');
let Patient = require("../models/Patient.model");
const Appointments = require("../models/Appointments.model");

router.get('/', async(req, res) => {
    try {
      const patients = await Patient.find()
      res.json(patients);
    } catch (e) {
      return res.status(404).json({
        msg: 'PATIENTS_NOT_FOUND'
      });
    }

})
router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try {
      const patient = await Patient.findById(id).populate('appointments').exec();
      res.json({
        data: { ...patient._doc, appointments: patient.appointments }
      });
    } catch (e) {
      return res.status(404).json({
        msg: 'PATIENT_NOT_FOUND'
      });
    }

})


router.post('/', patientValidation.create, (req, res) => {
     console.log(req.body)
    const newPatient = new Patient({
        fullName: req.body.fullName,
        phone: req.body.phone
    })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
        return res.status(422).json({ errors: errors.array() });
    }
    
    newPatient.save()
        .then(patient => res.status(201).json({
            patient,
            msg: "New patient successfuly added"
        }))
        .catch(err => {
            res.status(500).json({
                msg: err
            })
        })
})

router.put('/:id', patientValidation.create,async (req, res) => {
    const id = req.params.id
    const patient={
        fullName: req.body.fullName,
        phone: req.body.phone
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    Patient.findOneAndUpdate({ _id: id },patient, err => {
        if (err) {
            return res.status(404).json({ msg: "Patient not found" })
        } else {
            return res.status(200).json({ msg: "Patient successfuly updated" })
        }
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
    Patient.findByIdAndDelete(id).then(patient=>{
      console.log(patient)
      res.json({msg:"Patient deleted succesfuly"});
    }).catch(err=>{
      res.status(404).json({
        msg: 'PATIENT_NOT_FOUND'
    })
  })

})


module.exports = router