const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AppointmentsSchema = new Schema({
    dentNumber: { type: Number },
    diagnosis: { type: String },
    price: { type: Number },
    date: { type: String },
    time: { type: String },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' }

})

const Appointments = mongoose.model("Appointments", AppointmentsSchema)

module.exports = Appointments