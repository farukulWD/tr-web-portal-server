import express, { Application } from "express"
import cors from "cors"
import router from "./app/routes/routes"
import cookieParser from "cookie-parser"
import globalErrorHandler from "./app/middlewares/globalErrorhandler"
import notFound from "./app/middlewares/notFound"

const app:Application = express()

app.use(cors(
    {
        origin: "http://localhost:3000", 
        credentials: true    
    }
))

app.use(cookieParser())
app.use(express.json())

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFound)


export default app
