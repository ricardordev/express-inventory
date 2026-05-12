import express from 'express';
import rateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_SECONDS = 60

const limiter = rateLimit({
    windowMs: RATE_LIMIT_SECONDS * 1000,
    max: RATE_LIMIT_REQUESTS,
    message: {
        error: 'Too Many Requests',
        message: 'You exceeded the request limit. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json());
app.use('/api', limiter);
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`API running on port http://localhost:${PORT}`);
});