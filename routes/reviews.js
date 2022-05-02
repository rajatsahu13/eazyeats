const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { requireAuth, validateReview } = require('../middleware')

module.exports = function (app) {
    app.post('/api/reviews', requireAuth, validateReview, async (req, res) => {
        const { rating, body, id } = req.body
        try {
            let restaurant = await Restaurant.findById(id);
            if (restaurant) {
                const review = new Review({ rating: rating, body: body });
                review.author = req.session.user._id;
                restaurant.reviews.push(review);
                await review.save();
                await restaurant.save();
                restaurant = await Restaurant.findById(id).populate({
                    path: 'reviews',
                    populate: {
                        path: 'author'
                    }
                });
                let reviews = []
                const userReviews = restaurant.reviews.filter(review => review.author.email === req.session.user.email)
                userReviews.map(item => reviews.push(item))
                restaurant.reviews.map((review, i) => {
                    if (review.author.email !== req.session.user.email) {
                        reviews.push(review)
                    }
                })
                res.json({ success: true, message: 'Successfully posted review!', reviews: reviews })
            } else {
                throw 'Restaurant not found'
            }
        } catch (err) {
            console.log(err)
            res.json({ message: 'Cannot create review!' })
        }
    })

    app.delete('/api/reviews', requireAuth, async (req, res) => {
        const { restaurantId, reviewId } = req.body;
        try {
            let restaurant = await Restaurant.findByIdAndUpdate(restaurantId, { $pull: { reviews: reviewId } });
            await Review.findByIdAndDelete(reviewId);
            restaurant = await Restaurant.findById(restaurantId).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            });
            let reviews = []
            const userReviews = restaurant.reviews.filter(review => review.author.email === req.session.user.email)
            userReviews.map(item => reviews.push(item))
            restaurant.reviews.map((review, i) => {
                if (review.author.email !== req.session.user.email) {
                    reviews.push(review)
                }
            })
            res.json({ auth: true, success: true, reviews: reviews })
        } catch (err) {
            console.log(err)
        }
    })
}