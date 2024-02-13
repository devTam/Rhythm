import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import '@/db';
import { PORT } from '@/utils/variables';
import authRouter from '@/routers/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter)

app.listen(PORT, ()  => {
    console.log(`Server is running on port ${PORT}`);
});