import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import espRoutes from './routes/esp-routes'; 
import frontendRoutes from './routes/frontend-routes';
import { connectToDatabase } from './services/database-service';
const cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const clusterName = process.env.CLUSTER_NAME;
const databaseName = process.env.DATABASE_NAME;
const dbUrl = `mongodb+srv://${username}:${password}@${clusterName}.tir6wnc.mongodb.net/${databaseName}?retryWrites=true&w=majority`

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


connectToDatabase(dbUrl);

app.use('/esp', espRoutes);
app.use('/api', frontendRoutes);

app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`);
})
