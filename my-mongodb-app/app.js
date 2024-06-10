const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/data");

const uri =
  "mongodb+srv://nearinclusion:Near%401995MongoDB@learningclusterfornear.5mxlam7.mongodb.net/?retryWrites=true&w=majority&appName=LearningClusterForNear";

// const loginServer = require("./src/login");
const mainServer = require("./src/main");
// const port = process.env.PORT || 3000;
const port = 3032;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    mainServer.listen(port, () => {
      console.log(`API mainServer listening at http://localhost:${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
