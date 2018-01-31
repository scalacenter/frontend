// @flow

import fastdom from 'lib/fastdom-promise';

import { catchErrorsWithContext } from 'lib/robust';
import { forgottenEmail, passwordToggle } from 'common/modules/identity/forms';
import { Formstack } from 'common/modules/identity/formstack';
import {
    enhance as enhanceWizard,
    containerClassname as wizardContainerClassname,
} from 'common/modules/identity/wizard';
import { FormstackIframe } from 'common/modules/identity/formstack-iframe';
import { FormstackEmbedIframe } from 'common/modules/identity/formstack-iframe-embed';
import { init as initValidationEmail } from 'common/modules/identity/validation-email';
import { AccountProfile } from 'common/modules/identity/account-profile';
import { init as initPublicProfile } from 'common/modules/identity/public-profile';
import { enhanceEmailPrefs } from 'common/modules/identity/email-prefs';
import { enhanceFormAjax } from 'common/modules/identity/form-ajax';
import { enhanceConsents } from 'common/modules/identity/consents';
import { enhanceConsentWizard } from 'common/modules/identity/consent-wizard';
import { setupLoadingAnimation } from 'common/modules/identity/delete-account';
import { initUserAvatars } from 'common/modules/discussion/user-avatars';
import { init as initTabs } from 'common/modules/ui/tabs';

const initFormstack = (): void => {
    const attr = 'data-formstack-id';
    const forms = [...document.querySelectorAll(`[${attr}]`)];
    const iframes = [...document.getElementsByClassName('js-formstack-iframe')];

    forms.forEach(form => {
        const id = form.getAttribute(attr) || '';
        const isEmbed = form.className.match(/\bformstack-embed\b/);

        if (isEmbed) {
            new FormstackEmbedIframe(form, id).init();
        } else {
            new Formstack(form, id).init();
        }
    });

    // Load old js if necessary
    iframes.forEach(el => {
        const iframe: HTMLIFrameElement = (el: any);

        new FormstackIframe(iframe).init();
    });
};

const initWizards = (): void => {
    fastdom
        .read(() => [
            ...document.getElementsByClassName(wizardContainerClassname),
        ])
        .then(wizards => {
            wizards.forEach(wizardEl => {
                enhanceWizard(wizardEl);
            });
        });
};

const initAccountProfile = (): void => {
    // eslint-disable-next-line no-new
    new AccountProfile();
};

const initProfile = (): void => {
    const modules: Array<Array<string | Function>> = [
        ['init-form-stack', initFormstack],
        ['forgotten-email', forgottenEmail],
        ['password-toggle', passwordToggle],
        ['init-validation-email', initValidationEmail],
        ['init-user-avatars', initUserAvatars],
        ['init-tabs', initTabs],
        ['init-account-profile', initAccountProfile],
        ['enhance-email-prefs', enhanceEmailPrefs],
        ['setup-loading-animation', setupLoadingAnimation],
        ['init-public-profile', initPublicProfile],
        ['init-wizards', initWizards],
        ['enhance-consents', enhanceConsents],
        ['enhance-form-ajax', enhanceFormAjax],
        ['enhance-consent-wizard', enhanceConsentWizard],
    ];
    catchErrorsWithContext(modules);
};

export { initProfile };
