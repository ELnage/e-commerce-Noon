import express from "express"
import { config } from "dotenv";
import {db_connection} from "./DB/connection.js";
import { globalResponse } from "./src/middlewares/error-handling.middleware.js";

import cors from "cors"
import { mountRoutes } from "./src/mount.routes.js";
config()
const port = process.env.PORT

const app = express()


app.use(cors());
app.use(express.json())

mountRoutes(app)

app.use(globalResponse)

// app.use("/" , (req , res) => {
//   res.send("hello")
// })
db_connection()
app.listen(port, () => console.log(`server is running on port ${port}`));