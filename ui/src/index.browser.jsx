// @flow
/* eslint-env browser */
import { render } from '@guardian/guui';

import Body from 'components/body';
import routes from './routes';

const container: ?Element = document.body;

const renderApp = () => {
    const props = window.guardian;
    const Application = window.guardian.route
        ? routes[window.guardian.route]
        : routes.NotFound;

    if (container) {
        render(
            <Body {...props}>
                <Application {...props} />
            </Body>,
            container.parentElement,
            container
        );
    }
};

if (module.hot) {
    // chillout flow
    // $FlowFixMe
    module.hot.accept();

    // $FlowFixMe
    require('preact/devtools'); // eslint-disable-line
}

renderApp();
