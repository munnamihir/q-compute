import express from "express";
import qcompute from "./qcompute.js";
import authRoutes from "./auth.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/qcompute", qcompute);

app.listen(3000);
