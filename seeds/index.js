if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const restaurants = require('./seedData');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');
const Booking = require('../models/booking');
const { names, userIds, restaurantIds } = require('./userData');

const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const imageData = [
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1618959322/test/nick-karvounis-Ciqxn7FE4vE-unsplash_mq1juh.jpg",
        filename: "test/nick-karvounis-Ciqxn7FE4vE-unsplash_mq1juh"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1618959333/test/jay-wennington-N_Y88TWmGwA-unsplash_mhhguy.jpg",
        filename: "test/jay-wennington-N_Y88TWmGwA-unsplash_mhhguy.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640269079/test/jakub-kapusnak-4f4YZfDMLeU-unsplash_o7cz6x.jpg",
        filename: "test/jakub-kapusnak-4f4YZfDMLeU-unsplash_o7cz6x.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455878/test/sandra-seitamaa-OFJGlG3sKik-unsplash_bpptob.jpg",
        filename: "test/sandra-seitamaa-OFJGlG3sKik-unsplash_bpptob.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455868/test/syed-ahmad-kgjQ1AGDwE0-unsplash_fqgyoj.jpg",
        filename: "test/syed-ahmad-kgjQ1AGDwE0-unsplash_fqgyoj.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455849/test/albert-YYZU0Lo1uXE-unsplash_bhavrp.jpg",
        filename: "test/albert-YYZU0Lo1uXE-unsplash_bhavrp.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455848/test/jason-leung-poI7DelFiVA-unsplash_gfhwq9.jpg",
        filename: "test/jason-leung-poI7DelFiVA-unsplash_gfhwq9.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455847/test/daan-evers-tKN1WXrzQ3s-unsplash_qh0b5n.jpg",
        filename: "test/daan-evers-tKN1WXrzQ3s-unsplash_qh0b5n.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455844/test/luisa-brimble-aFzg83dvnAI-unsplash_hppmzw.jpg",
        filename: "test/luisa-brimble-aFzg83dvnAI-unsplash_hppmzw.jpg"
    },
    {
        url: "https://res.cloudinary.com/dsqzncnif/image/upload/v1640455841/test/pablo-merchan-montes-Orz90t6o0e4-unsplash_tio8q0.jpg",
        filename: "test/pablo-merchan-montes-Orz90t6o0e4-unsplash_tio8q0.jpg"
    },
]

const seedDB = async () => {
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Booking.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const userData = new User({
            _id: `${userIds[i]}`,
            email: `${names[i]}@gmail.com`,
            name: `${names[i]}`,
            password: '123'
        })
        await userData.save();
    }

    for (let i = 0; i < restaurants.length; i++) {
        const price = Math.floor(Math.random() * 500) + 50;
        const timingData = restaurants[i].operating_hours;
        const restaurantData = new Restaurant({
            _id: `${restaurantIds[i]}`,
            title: `${restaurants[i].name}`,
            location: `${restaurants[i].address}`,
            price,
            cuisines: `${restaurants[i].cuisine_type}`,
            timings: {
                Monday: `${timingData.Monday}`,
                Tuesday: `${timingData.Tuesday}`,
                Wednesday: `${timingData.Wednesday}`,
                Thursday: `${timingData.Thursday}`,
                Friday: `${timingData.Friday}`,
                Saturday: `${timingData.Saturday}`,
                Sunday: `${timingData.Sunday}`
            },
            geometry: {
                type: "Point",
                coordinates: [
                    restaurants[i].latlng.lng,
                    restaurants[i].latlng.lat
                ]
            },
            images: [
                shuffle(imageData)[0],
                shuffle(imageData)[1],
                shuffle(imageData)[2],
                shuffle(imageData)[3],
            ]
        })
        await restaurantData.save();
    }

    for (let i = 0; i < 10; i++) {
        const id = restaurantIds[i];
        const restData = await Restaurant.findById(id);
        for (let review of restaurants[i].reviews) {
            const random10 = Math.floor(Math.random() * 10);
            const reviewData = new Review({
                body: `${review.comments}`,
                rating: `${review.rating}`,
                date: `${review.date}`,
                author: `${userIds[random10]}`
            })
            restData.reviews.push(reviewData);
            await reviewData.save();
            await restData.save();
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})