import { logger } from './logger';

/**
 * Handles body parser errors
 *
 */

function bodyParserHandler (err, req, res, next) {
    if (err.type === 'entity.parse.failed' ||
    err.type === 'encoding.unsupported' ||
    err.type === 'request.aborted' ||
    err.type === 'entity.too.large' ||
    err.type === 'request.size.invalid' ||
    err.type === 'stream.encoding.set' ||
    err.type === 'parameters.too.many' ||
    err.type === 'charset.unsupported' )
    {

        logger.log({
            level: 'error',
            message: err.message
        });
        res.status(err.statusCode)
            .send({
                error: err.expose ? err.message : "Invalid Request."
            });
    } else {
        next(err);
    }
}

/**
 * Generic error handler
 */

function genericErrorHandler(err, req, res, next) {
    logger.log({
        level: 'error',
        message: err.message
    });

    res.status(500)
       .send({ error: "Server Error."});
}

function setupErrorHandlers (app) {
   app.use(bodyParserHandler);
   app.use(genericErrorHandler);
}


export default setupErrorHandlers;