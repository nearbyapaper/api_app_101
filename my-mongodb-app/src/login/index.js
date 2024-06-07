const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(express.json());

const uri =
  "mongodb+srv://nearinclusion:Near%401995MongoDB@learningclusterfornear.5mxlam7.mongodb.net/?retryWrites=true&w=majority&appName=LearningClusterForNear";
const client = new MongoClient(uri);

let collection;

async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collection
    const database = client.db("nearMongoDB");
    collection = database.collection("userCollection");

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
  }
}

connectToDatabase().then(() => {
  // Define routes
  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
  });

  app.post("/user/create", async (req, res) => {
    const user = req.body;
    try {
      await createUser(user);
      res.send(`User created: ${JSON.stringify(user)}`);
    } catch (e) {
      res.status(500).send("Error creating user");
    }
  });

  app.post("/user/login", async (req, res) => {
    const user = req.body;
    try {
      await loginUser(user);
      res.send(`User login: ${JSON.stringify(user)}`);
    } catch (e) {
      res.status(500).send("Error login user");
    }
  });

  // Start the server after connecting to the database
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

async function createUser(user) {
  try {
    // Data to insert
    const doc = {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.userName || "",
      password: user?.password || "",
      phone: user?.phone || "",
      address: user?.address || "",
    };

    // Insert a single document
    const result = await collection.insertOne(doc);
    console.log(
      `New document inserted with the following id: ${result.insertedId}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function loginUser(user) {
  console.log("API Side - loginUser  :: " + user);
  console.log("API Side - collection  :: " + collection);
  console.log("API Side - user?.userName  :: " + user?.userName);
  console.log("API Side - user?.password  :: " + user?.password);
  try {
    const findUser = await collection.findOne({
      username: user?.userName,
      password: user?.password,
    });
    console.log("API Side - findUser  :: " + findUser);
    if (findUser) {
      console.log("API User found:", findUser);
      const successResponse = {
        success: true,
        message: "Login successful",
        data: findUser,
        code: 200,
      };
      console.log("API User successResponse:", successResponse);
      return successResponse;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error querying user:", error);
    throw error;
  }
  // finally {
  //   await db.client.close();
  // }
}

// Export the app
module.exports = app;
