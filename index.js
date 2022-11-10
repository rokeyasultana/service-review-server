const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());


//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kz5fz2c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
  try{

    const serviceCollection = client.db('service-review').collection('services');
    const reviewCollection = client.db('service-review').collection('reviews');
//get service

    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
  });

//get review
app.get('/reviews',async(req,res)=>{
  const query = {}
  const cursor = reviewCollection.find(query);
  const reviews = await cursor.toArray()
  res.send(reviews);
})

//get review buy email

app.get('/reviews',async(req,res)=>{
  let query = {}
  if(req.query.email){
    query ={
      email:req.query.email
    }
  }

  const cursor = reviewCollection.find(query);
  const reviews = await cursor.toArray()
  res.send(reviews);
})

  //get service by id

  app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await serviceCollection.findOne(query);
    res.send(service);
});

//review update
app.patch('/reviews/:id',async(req,res)=>{
  const id = req.params.id;
  const status =req.body.status;
  const query = {_id: ObjectId(id)}
  const updateDoc ={
    $set:{
      status:status
    }
  }
  const result =await reviewCollection.updateOne(query,updateDoc);
  res.send(result);
})

app.delete('/reviews/:id',async(req,res)=>{
  const id =req.params.id;
  const query ={_id: ObjectId(id)};
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
})


//app.post

app.post('/services',async(req,res)=>{
  const NewServices = req.body;
  const result = await serviceCollection.insertOne(NewServices);
  res.send(result);
})


//add review

app.post('/reviews', async (req, res) => {
  const reviews = req.body;
  const result = await  reviewCollection.insertOne(reviews);
  res.send(result);
});


  }


  finally{

  }

}



run().catch(err => console.err(err));



app.get('/', (req, res) => {
  res.send('Service Review Website')
})

app.listen(port, () => {
  console.log(`Service Review Website listening on port ${port}`)
})

