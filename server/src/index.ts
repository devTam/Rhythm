import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import '@/db';
import { PORT } from '@/utils/variables';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()  => {
    console.log(`Server is running on port ${PORT}`);
});