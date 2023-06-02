require('dotenv').config();
const http = require('http');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const { getMedia } = require('../lib/booksy');

const PORT = process.env.PORT || 8000;
const app = express();

const client = new MongoClient(process.env.MONGODB_URI);
const servicesDb = client.db('services');

const categoriesCol = servicesDb.collection('categories');
const listsCol = servicesDb.collection('lists');

app.use(cors());

app.get('/services', (req, res) => {
    const pipeline = [
        {
            $match: { active: true }
        },
        {
            $lookup: {
                from: 'lists',
                localField: '_id',
                foreignField: 'category_id',
                as: 'services'
            }
        },
        {
            $addFields: { 
                services_count: { $size: "$services" }
            }
        },
    ];

    if (req.query.limitServices && !isNaN(parseInt(req.query.limitServices))) {
        pipeline.push(        {
            $project: {
                services: {
                    $slice: ["$services", 0, parseInt(req.query.limitServices)]
                },
                _id: 1,
                name: 1,
                services_count: 1,
                ative: 1,
                en_variant: 1
            }
        });
    }

    categoriesCol.aggregate(pipeline).toArray().then((categoriesWithServices) => {
        res.status(200).json(categoriesWithServices);
    })
});

app.get('/services/:id', (req, res) => {
    const id = req.params.id;

    listsCol.findOne({ _id: ObjectId.cacheHexString(id) }).then((service) => {
        if (!service) {
            res.status(404).json({ error: 'not found' });
            return;
        }

        res.status(200).json(service);
    })
});

app.get('/services/categories', (req, res) => {
    categoriesCol.find().toArray().then((categories) => {
        res.status(200).json(categories);
    });
});

app.get('/services/categories/:id', (req, res) => {
    const id = req.params.id;

    categoriesCol.findOne({ _id: ObjectId.createFromHexString(id) }).then((category) => {
        if (!category) {
            res.status(404).json({ error: 'not found' });
            return;
        }

        res.status(200).json(category);
    });
});

app.get('/legacy/proxy/booksy/images', (req, res) => {
    getMedia().then((data) => res.status(200).json(data));
});

const server = http.createServer(app);

client.connect().then(() => {
    console.log('MongoDB connected');
    server.listen(PORT,
        () => console.log('Server listening at: localhost:%s', PORT));
});