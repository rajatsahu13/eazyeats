const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const Review = require('../models/review')
const Restaurant = require('../models/restaurant')
const Booking = require('../models/booking')
const { requireAuth } = require('../middleware')

const maxAge = "14d"

module.exports = function (app) {

    app.post('/api/auth/register', async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const user = await User.findOne({ email })
            if (!user) {
                const newUser = new User({ name, email, password });
                await newUser.save()
                const id = newUser._id
                const token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: maxAge
                })
                req.session.user = newUser
                res.json({ auth: true, token: token, user: newUser, message: 'Successfully registered!' })
            } else {
                res.json({ message: 'That email is already registered!' })
            }
        } catch (err) {
            console.log(err)
        }
    })

    app.post('/api/auth/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email })
            if (user) {
                bcrypt.compare(password, user.password, (error, response) => {
                    if (response) {
                        const id = user._id
                        const token = jwt.sign({ id }, process.env.SECRET, {
                            expiresIn: maxAge
                        })
                        req.session.user = user
                        res.json({ auth: true, token: token, user: user, message: "Successfully logged in!" })
                    } else {
                        res.json({ message: "Wrong password!" })
                    }
                })
            } else {
                res.json({ message: "That email is not registered!" })
            }
        } catch (err) {
            console.log(err)
        }
    })

    app.get("/api/auth/checkUser", (req, res) => {
        const token = req.headers["x-access-token"]
        if (!token) {
            req.session.user = null
            res.json({ loggedIn: false })
        } else {
            jwt.verify(token, process.env.SECRET, async (err, decoded) => {
                if (err) {
                    req.session.user = null
                    res.json({ loggedIn: false })
                } else {
                    let user = await User.findById(decoded.id);
                    req.session.user = user
                    res.json({ loggedIn: true, user: req.session.user })
                }
            })
        }
    })

    app.get("/api/auth/logout", requireAuth, (req, res) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.log(err)
                } else {
                    res.json({ success: true })
                }
            });
        }
    })

    app.get("/api/users/:id/reviews", requireAuth, async (req, res) => {
        const { id } = req.params
        try {
            const reviews = await Review.find().sort({ date: -1 }).where('author').equals(id);
            let reviewids = [];
            let allRestaurants = [];
            reviewids = reviews.map(function (x) {
                return x.id
            })
            for (let i = 0; i < reviewids.length; i++) {
                restaurant = await Restaurant.find().where('reviews').equals(reviewids[i])
                allRestaurants.push(restaurant)
            }
            res.json({ auth: true, reviews: reviews, allRestaurants: allRestaurants });
        } catch (err) {
            console.log(err)
        }
    })

    app.get("/api/users/:id/bookings", requireAuth, async (req, res) => {
        const { id } = req.params
        try {
            const bookings = await Booking.find().where('author').equals(id).populate({
                path: 'author'
            }).populate('restaurant');
            res.json({ auth: true, bookings: bookings })
        } catch (err) {
            console.log(err)
        }
    })

    app.delete('/api/users/:id/reviews', requireAuth, async (req, res) => {
        const { id } = req.params
        try {
            const { restaurantId, reviewId } = req.body;
            await Restaurant.findByIdAndUpdate(restaurantId, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            const reviews = await Review.find().sort({ date: -1 }).where('author').equals(id);
            let reviewids = [];
            let allRestaurants = [];
            reviewids = reviews.map(function (x) {
                return x.id
            })
            for (let i = 0; i < reviewids.length; i++) {
                restaurant = await Restaurant.find().where('reviews').equals(reviewids[i])
                allRestaurants.push(restaurant)
            }
            res.json({ auth: true, success: true, reviews: reviews, allRestaurants: allRestaurants })
        } catch (err) {
            console.log(err)
        }
    })
}