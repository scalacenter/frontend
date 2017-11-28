// @flow
/* eslint-disable global-require */
import { server } from '@guardian/guui';

import head from 'components/head';
import Body from 'components/body';
import routes from './routes';

const app = server();

// the main export for the JVM JS interpreter to run
// eslint-disable-next-line import/prefer-default-export
export const render = (props: Object) => {
    let Application;

    if (props.route && routes[props.route]) {
        Application = routes[props.route];
    } else {
        Application = routes.notfound;
    }
    const body = app.renderToString(
        <Body {...props}>
            <Application {...props} />
        </Body>
    );
    const css = app.extractCriticalCss(body);

    return `
        <!DOCTYPE html>
        <html lang="en">
            ${head(props, css)}
            ${body}
        </html>
    `.trim();
};
