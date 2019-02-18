import express from 'express';
import setupMiddleware from './globalMiddleware';
import connect from './db';
import routes from './Routes';
import setupErrorHandlers from './errorHandlers';

const app = express();

// Setup database connection
connect();

// Setup Middleware
setupMiddleware(app);

app.use('/api', routes);

app.use(express.static('public'));

app.get('*', (req, res, next) => {
    res.redirect('/');
});

setupErrorHandlers(app);

export default app;