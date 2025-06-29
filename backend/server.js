import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import './Models/db.js'; 
import AuthRouter from './Routes/AuthRouter.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is ready.');
});

app.use('/auth', AuthRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
