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
    collection = database.collection("taskCollection");

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
  }
}

connectToDatabase().then(() => {
  // Define routes
  app.post("/task/create", async (req, res) => {
    const task = req.body;
    try {
      await createTask(task);
      res.send(`Task created: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error Task created");
    }
  });

  app.post("/task/delete", async (req, res) => {
    const task = req.body;
    try {
      await deleteTask(task);
      res.send(`Task delete: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error Task delete");
    }
  });

  app.post("/task/update", async (req, res) => {
    const task = req.body;
    try {
      await updateTask(task);
      res.send(`Task update: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error Task update");
    }
  });

  // Start the server after connecting to the database
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

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

async function deleteTask(task) {
  try {
    const findTask = await collection.findOne({
      id: task?.id,
      name: task?.name,
      createdDate: task?.createdDate,
    });
    const result = await collection.deleteOne(findTask); // Use deleteMany(query) to delete multiple documents
    console.log(`${result.deletedCount} document(s) deleted`);
  } catch (error) {
    console.error("Error querying user:", error);
    throw error;
  }
}

async function updateTask(task) {
  try {
    const findTask = await collection.findOne({
      id: task?.id,
      name: task?.name,
      createdDate: task?.createdDate,
    });
    const result = collection.updateOne(findTask, { $set: task }); // Use updateMany(query, { $set: update }) to update multiple documents

    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );
    console.log(`${result.modifiedCount} document(s) were updated.`);
  } catch (error) {
    console.error("Error querying user:", error);
    throw error;
  }
}

// Export the app
module.exports = app;
