const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(express.json());

// ADD THIS
var cors = require("cors");
app.use(cors());

const uri =
  "mongodb+srv://nearinclusion:Near%401995MongoDB@learningclusterfornear.5mxlam7.mongodb.net/?retryWrites=true&w=majority&appName=LearningClusterForNear";
const client = new MongoClient(uri);

const API_PORT = 3031;

let userCollection;
let taskCollection;

// -------------------- LOGIN API --------------------
async function connectToDatabase() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database and collections
    const database = client.db("nearMongoDB");
    userCollection = database.collection("userCollection");
    taskCollection = database.collection("taskCollection");

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
      const loginResponse = await loginUser(user);
      if (loginResponse) {
        res.send(loginResponse);
      } else {
        res.status(401).send("Invalid username or password");
      }
    } catch (e) {
      res.status(500).send("Error logging in user");
    }
  });

  // -------------------- TASK API --------------------
  app.post("/task/create", async (req, res) => {
    const task = req.body;
    try {
      await createTask(task);
      res.send(`Task created: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error creating task");
    }
  });

  app.post("/task/delete", async (req, res) => {
    const task = req.body;
    try {
      await deleteTask(task);
      res.send(`Task deleted: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error deleting task");
    }
  });

  app.post("/task/update", async (req, res) => {
    const task = req.body;
    try {
      await updateTask(task);
      res.send(`Task updated: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error updating task");
    }
  });

  // Start the server after connecting to the database
  app.listen(API_PORT, (err) => {
    if (err) {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${API_PORT} is already in use.`);
      } else {
        console.error(err);
      }
      process.exit(1);
    } else {
      console.log("Server is running on port " + API_PORT);
    }
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
    const result = await userCollection.insertOne(doc);
    console.log(
      `New document inserted with the following id: ${result.insertedId}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function loginUser(user) {
  try {
    const findUser = await userCollection.findOne({
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
      return successResponse;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

// -------------------- TASK API --------------------
async function createTask(task) {
  console.log("API Side - createTask  :: " + task);
  try {
    const doc = {
      id: task?.id || "",
      name: task?.name || "",
      type: task?.type || "",
      status: task?.status || "",
      detail: task?.detail || "",
      targetDate: task?.targetDate || "",
      createdDate: task?.createdDate || "",
      createdUser: task?.createdUser || "",
    };

    // Insert a single document
    const result = await taskCollection.insertOne(doc);
    console.log(
      `New document inserted with the following id: ${result.insertedId}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteTask(task) {
  try {
    const result = await taskCollection.deleteOne({
      id: task?.id,
      name: task?.name,
      createdDate: task?.createdDate,
    });
    console.log(`${result.deletedCount} document(s) deleted`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

async function updateTask(task) {
  try {
    const result = await taskCollection.updateOne(
      { id: task?.id, name: task?.name, createdDate: task?.createdDate },
      { $set: task }
    );
    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) were updated.`);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Export the app
module.exports = app;
