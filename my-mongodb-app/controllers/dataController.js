const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://nearinclusion:Near%401995MongoDB@learningclusterfornear.5mxlam7.mongodb.net/?retryWrites=true&w=majority&appName=LearningClusterForNear";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function insertData(req, res) {
  try {
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("myCollection");

    const doc = req.body; // Assume the document to insert is in the request body
    const result = await collection.insertOne(doc);

    res
      .status(201)
      .json({ message: "Data inserted", insertedId: result.insertedId });
  } catch (e) {
    res.status(500).json({ message: "Error inserting data", error: e });
  } finally {
    await client.close();
  }
}

async function checkNewData(req, res) {
  try {
    await client.connect();
    const database = client.db("myDatabase");
    const collection = database.collection("myCollection");

    // Retrieve the latest documents, sorted by insertion time
    const docs = await collection.find().sort({ _id: -1 }).limit(10).toArray();

    res.status(200).json(docs);
  } catch (e) {
    res.status(500).json({ message: "Error retrieving data", error: e });
  } finally {
    await client.close();
  }
}

module.exports = { insertData, checkNewData };
