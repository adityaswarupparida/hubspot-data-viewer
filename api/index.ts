import express from "express";
import cors from "cors";
import v1Router from "./routes/v1"

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ 
    origin: "http://localhost:3001"
}));

app.use("/api/v1", v1Router);

app.listen(3000, () => {
    console.log(`Server is listening at port ${PORT}`);
});