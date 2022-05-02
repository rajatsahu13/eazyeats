const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    date: Date,
    guests: Number,
    firstname: String,
    lastname: String,
    email: String,
    phone: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
})

module.exports = mongoose.model('Booking', BookingSchema);