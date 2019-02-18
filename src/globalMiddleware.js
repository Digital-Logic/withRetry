import bodyParse from 'body-parser';
import setupLogger from './logger';

function useMiddleware (app) {
    app.use(bodyParse.urlencoded({
        extended: true
    }));
    app.use(bodyParse.json());

    setupLogger(app);
}

export default useMiddleware;