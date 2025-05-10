const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const port = 3000;

/* HTML ENDPOINTS */
app.get("/", (req, res) => {
  res.send(fs.readFileSync("./index.html", "utf8"));
});

/* API ENDPOINTS */
//  creates a new file with timestamp as the file name
app.post("/api", (req, res) => {
  let filename = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "");
  let content = req.body;
  fs.writeFileSync(`./data/${filename}.json`, JSON.stringify(content));

  res.setHeader("filename", filename);
  res.json(content);
});

//  create a method to append the new pet to the bottom of the json file
app.put("/api/:documentid", (req, res) => {
  //  creates file path
  const filePath = `./data/${req.params.documentid}.json`;
  //  creates new pet object
  let newPet = req.body;
  //  initiates petList
  let petList = [];
  //  fills pet list
  if (fs.existsSync(filePath)) {
    petList = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  //  adds new pet
  petList.push(newPet);
  //  writes to file
  fs.writeFileSync(filePath, JSON.stringify(petList), "utf8");
  //  creates content and sets it to new written file
  let content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // res.setHeader("filename", filename);
  res.json(content);
});

//  call that returns the whole JSON file
app.get("/api/:documentid", (req, res) => {
  let content = fs.existsSync(`./data/${req.params.documentid}.json`)
    ? JSON.parse(
        fs.readFileSync(`./data/${req.params.documentid}.json`, "utf8")
      )
    : {};
  res.json(content);
});
//  rewrites the whole file with the request
app.put("/api/:documentid/reset", (req, res) => {
  const filePath = `./data/${req.params.documentid}.json`;
  let content = req.body;
  fs.writeFileSync(filePath, JSON.stringify(content), "utf8");
  res.json(content);
});

//  create a call to delete a chosen pet
app.delete("/api/:documentid", (req, res) => {
  //  create file path
  const filePath = `./data/${req.params.documentid}.json`;
  const petToBeRemoved = req.body.name;
  let pets = JSON.parse(fs.readFileSync(filePath, "utf8"));
  //  check if it exists
  //  if it does exist then remove the chosen pet using pet object

  pets = pets.filter((pet) => pet.name !== petToBeRemoved);
  fs.writeFileSync(filePath, JSON.stringify(pets), "utf8");
  res.json({ message: `Removed pet named "${petToBeRemoved}".` });
});

//  deletes all the pets dont use this unless all hell breaks loose
app.delete("/api/:documentid", (req, res) => {
  if (fs.existsSync(`./data/${req.params.documentid}.json`))
    fs.unlinkSync("./data.json");
  res.json({ message: "data deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
