import express, { Application } from "express"
import cors from "cors"
import router from "./app/routes/routes"
import cookieParser from "cookie-parser"

const app:Application = express()

app.use(cors())

app.use(cookieParser())
app.use(express.json())

app.use('/api/v1', router);


export default app
