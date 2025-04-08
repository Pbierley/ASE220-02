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

app.get("/detail", (req, res) => {
  res.send("HTML endpoint: detail");
});

/* API ENDPOINTS */
app.post("/api", (req, res) => {
  let filename = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "");
  let content = req.body;
  fs.writeFileSync(`./data/${filename}.json`, JSON.stringify(content));

  res.setHeader("filename", filename);
  res.json(content);
});
app.get("/api/:documentid", (req, res) => {
  let content = fs.existsSync(`./data/${req.params.documentid}.json`)
    ? JSON.parse(
        fs.readFileSync(`./data/${req.params.documentid}.json`, "utf8")
      )
    : {};
  res.json(content);
});
app.put("/api/:documentid", (req, res) => {
  let content = req.body;
  fs.writeFileSync(
    `./data/${req.params.documentid}.json`,
    JSON.stringify(content)
  );
  res.json(content);
});
app.delete("/api/:documentid", (req, res) => {
  if (fs.existsSync(`./data/${req.params.documentid}.json`))
    fs.unlinkSync("./data.json");
  res.json({ message: "data deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
