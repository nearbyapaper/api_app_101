const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Define a simple GET route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Define a simple GET route with a parameter
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});

// Define a simple POST route
app.post("/user", (req, res) => {
  const user = req.body;
  res.send(`User created: ${JSON.stringify(user)}`);
});

// Start the server
app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
