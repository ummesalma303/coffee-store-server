const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require("dotenv").config()
const cors = require('cors');
const app=express()
const port=process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
        
        
        
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

// *single read data

app.get('/coffee/:id',async(req,res)=>{
  const id = req.params.id 
  const updateCoffee= req.body

  const query = { _id: new ObjectId(id) };

  const result = await coffeeCollection.findOne(query);
  // res.send(result)
  res.send(result)
  // console.log(updateCoffee)
})
// *read

app.get('/coffee',async(req,res)=>{
  const cursor = coffeeCollection.find();
  // await cursor.forEach(console.dir);
  const result= await cursor.toArray()


  res.send(result)
  console.log(req.body)
})

// *post

    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body
        console.log(newCoffee)
        
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result)
    })


//^put
app.put('/coffee/:id',async(req,res)=>{
  const id = req.params.id
  
   const filter = { _id: new ObjectId(id) };

   const options = { upsert: true };

   const updateCoffees = {
    $set: req.body,
  };
    const result = await coffeeCollection.updateOne(filter, updateCoffees, options);

    res.send(result)

})

// !Delete

app.delete("/coffee/:id",async(req,res)=>{
  const id = req.params.id
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.deleteOne(query);
  console.log(result)
  res.send(result)
})

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('coffee making server is running')
    console.log()
})

app.listen(port,()=>{
    console.log('coffee making server is running on port:',port)
})