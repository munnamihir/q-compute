import express from "express";
import qcompute from "./qcompute.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/qcompute", qcompute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
