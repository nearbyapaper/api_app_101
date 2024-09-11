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
    collection = database.collection("postpaidCollection");

    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
  }
}

connectToDatabase().then(() => {
  // Define routes
  app.post("/mock/postpaid/validateScanBarcode", async (req, res) => {
    const mockReq = {
      simBarCode: "66949415156",
      userCode: "Arwut",
      userLan: "OMRMOBILE01",
      userFormatType: "USER_LAN",
    };
    try {
      await validateScanBarcode(mockReq);
      res.send(`Task created: ${JSON.stringify(task)}`);
    } catch (e) {
      res.status(500).send("Error Task created");
    }
  });

  // Start the server after connecting to the database
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

async function validateScanBarcode(req) {
  try {
    const mockResponse = {
      codeType: "S",
      code: "200",
      desc: "",
      systemMessage: "",
      replaceMessage: [],
      responseDateTime: "26-08-2567 14:38",
      data: {
        isNiceNumber: true,
        packageGroupCode: "12127725",
        packageGroupDescriptionEng:
          "Lucky_New Co 499B(call250min_net40GB)-Normal",
        switchOnReasonCode: "11000008",
        dealerNumber: "10001002",
        subscriberNumber:
          "511874c87f770d1b3b46d1985a7e5d956adc7d7ee6b07d64f625072a1d0dc389",
        companyCode: "20",
        telephoneType: "TEL",
        minPrice: 499,
        simType: "Normal",
        contractPeriod: 6,
        advancePayment: 0,
        penaltyRate: 4000,
        packageGroupType: "10",
        simCardNumber: "8966051310403920106",
        customerNumber: 0,
        lastChangeDateTime: "",
      },
    };
    return mockResponse;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// Export the app
module.exports = app;
