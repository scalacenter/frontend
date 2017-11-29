const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../__config__/webpack.config.dev')({
    browser: true,
});
const inputProps = require('./input-props');

const compiler = webpack(webpackConfig);
const app = express();
const propsUrl = 'http://localhost:9000/dev/ui/props.json';

const respond = (req, res, next, props = {}) => {
    return (errors, response, body) => {
        delete require.cache[require.resolve('../dist/ui.bundle.server')];

        // $FlowFixMe
        const { frontend } = require('../dist/ui.bundle.server'); // eslint-disable-line global-require, import/no-unresolved

        const errorMsg = `
            <h1>
                Unable to connect to
                <a href="${propsUrl}">${propsUrl}</a>.
                Are you running the archive application?
            </h1>`;

        if (errors) {
            if (errors.code === 'ECONNREFUSED') {
                return res.send(errorMsg);
            }
            return res.send(errors);
        }

        if (response.statusCode === 404) {
            return res.send(errorMsg);
        }

        if (body.includes('play-error-page')) {
            res.send(body);
        }

        try {
            return res.send(frontend.render(
                Object.assign(JSON.parse(body), props)
            ));
        } catch (e) {
            return next(e);
        }
    }
}

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/assets/fonts', express.static('../static/target/fonts'));
app.use(webpackHotMiddleware(compiler));
app.get('/component/*', (req, res, next) => {
    res.send(inputProps(req.path.split('/')[2].toLowerCase()));
});
app.post('/component/*', (req, res, next) => {
    try {
        request(
            propsUrl,
            respond(
                req,
                res,
                next,
                Object.assign(
                    {
                        route: req.path.split('/')[2].toLowerCase(), //TODO: how brittle this is!
                    },
                    JSON.parse(req.body.json) //TODO: and this!
                )
            )
        );
    } catch (e) {
        return next(e);
    }

});
app.get('/', (req, res, next) => {
    request(propsUrl, respond(req, res, next));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.status(500).send(err.stack);
});
app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('UI rendering dev server listening on port 3000\n');
});
