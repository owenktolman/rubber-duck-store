import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import duckRoutes from './routes/duck.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
// enable cors for any unknown origin DANGER
app.use(cors());

app.use('/api/ducks', duckRoutes)


app.listen(PORT, () => {
    connectDB()
    console.log('Listening on port ' + PORT)
})


