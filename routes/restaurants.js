const Restaurant = require('../models/restaurant');
const Booking = require('../models/booking');
const FuzzySearch = require('fuzzy-search');
const { requireAuth, validateBooking } = require('../middleware')

module.exports = function (app) {
    app.post('/api/restaurants', async (req, res) => {
        let { searchQuery } = req.body
        if (searchQuery) {
            searchQuery = searchQuery.slice(0, 1).toUpperCase() + searchQuery.slice(1, searchQuery.length)
            let restaurants = await Restaurant.find({ cuisines: searchQuery })
            if (!restaurants.length) {
                restaurants = await Restaurant.find({});
                const searcher = new FuzzySearch(restaurants, ['title', 'location'], { sort: true });
                restaurants = searcher.search(searchQuery);
            }
            res.json({ searchQuery: searchQuery, restaurants: restaurants })
        } else {
            const restaurants = await Restaurant.find({});
            res.json({ restaurants: restaurants })
        }
    })

    app.get('/api/restaurants/:id', async (req, res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
            if (restaurant) {
                res.json(restaurant)
            } else {
                throw 'Restaurant not found!'
            }
        } catch (err) {
            console.log(err)
            res.json({ error: true })
        }
    })

    app.get('/api/restaurants/:id/reviews', async (req, res) => {
        try {
            const restaurant = await Restaurant.findById(req.params.id).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
            let reviews = []
            if (req.session.user) {
                const userReviews = restaurant.reviews.filter(review => review.author.email === req.session.user.email)
                userReviews.map(item => reviews.push(item))
                restaurant.reviews.map((review, i) => {
                    if (review.author.email !== req.session.user.email) {
                        reviews.push(review)
                    }
                })
                res.json({ reviews: reviews })
            } else {
                reviews = restaurant.reviews
                res.json({ reviews: reviews })
            }
        } catch (err) {
            console.log(err)
        }
    })

    app.post('/api/restaurants/:id/book', requireAuth, validateBooking, async (req, res) => {
        const { id } = req.params;
        try {
            const booking = new Booking(req.body);
            booking.author = req.session.user._id
            booking.restaurant = id;
            await booking.save();
            res.json({ success: true, message: 'Successfully booked a table!' })
        } catch (err) {
            res.json({ message: 'Cannot find a table!' })
        }
    })
}