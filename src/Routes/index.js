import { Router } from 'express';

const successRoute = Router();
const oneEachRoute = Router();
const randomRoute = Router();
const failedRoute = Router();
const routeGroup = Router();


function delayResponse(response, maxDelay=500) {
    setTimeout(response,
        Math.floor(Math.random() * maxDelay));
}

successRoute.route('/')
    .post( (req, res, next) => {
        delayResponse(() => {
            res
                .status(200)
                .json({
                    message: 'ok'
                });
        });
    });

oneEachRoute.route('/')
    .post( (req, res, next) => {

    });

randomRoute.route('/')
    .post((req, res, next) => {
        delayResponse(() => {
            // Generate a true or false value, false should occur 2/3s of the time
            switch(Boolean(Math.round(Math.random()))) {
                case true:
                    res.status(200)
                        .json({
                            message: 'ok'
                        });
                    break;
                default:
                    res.status(500)
                        .json({
                            message: 'error'
                        });
            }
        });
    });

failedRoute.route('/')
    .post((req, res, next) => {
        delayResponse(() => {
            res.status(500)
                .json({
                    message: 'error'
                });
        });
    });

routeGroup.use('/success', successRoute);
routeGroup.use('/random', randomRoute);
routeGroup.use('/failed', failedRoute);

export default routeGroup;