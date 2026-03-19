import express from "express";
import qcompute from "./qcompute.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/qcompute", qcompute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
