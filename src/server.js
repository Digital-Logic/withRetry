import express from 'express';
import setupMiddleware from './globalMiddleware';
import connect from './db';
import routes from './Routes';

const app = express();

// Setup database connection
connect();

// Setup Middleware
setupMiddleware(app);

app.use('/api', routes);

app.all('*', (req, res) => {
    res.json({ message: "Hello World!"});
});

export default app;