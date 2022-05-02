const jwt = require('jsonwebtoken');
const { reviewSchema, bookingSchema } = require('./schemas')

module.exports.requireAuth = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                res.json({ message: 'Cannot create review!' })
            } else {
                next();
            }
        });
    } else {
        console.log('Login first');
        res.json({ auth: false })
    }
};

module.exports.validateReview = (req, res, next) => {
    const { rating, body } = req.body
    const { error } = reviewSchema.validate({ rating, body });
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg)
        res.json({ message: 'Cannot create review!' })
    } else {
        next();
    }
}

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg)
        res.json({ message: 'Cannot find a table!' })
    } else {
        next();
    }
}
