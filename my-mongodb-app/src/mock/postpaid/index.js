// Import necessary modules
const express = require("express");
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Define a route to handle the mock postpaid validation
app.post("/mock/postpaid/validateScanBarcode", async (req, res) => {
  const mockReq = {
    simBarCode: "66949415156",
    userCode: "Arwut",
    userLan: "OMRMOBILE01",
    userFormatType: "USER_LAN",
  };

  try {
    // Call the validation function
    const mockres = await validateScanBarcode(mockReq);

    // Send a response with the task object
    res.json({ message: "Task created successfully", mockres });
  } catch (e) {
    // Send error response
    console.error("Error call mock", e);
    res.status(500).json({ error: "Failed to call mock" });
  }
});

// Function to simulate barcode validation
async function validateScanBarcode(req) {
  try {
    // Mock response object to simulate a successful validation
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
    console.error("Error during validation", e);
    throw e; // Throw the error to be caught in the calling function
  }
}

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Export the app for testing or other uses
module.exports = app;
