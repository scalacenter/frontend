// @flow

import $ from 'lib/$';
import userPrefs from 'common/modules/user-prefs';
import { Message } from './message';

jest.mock('common/modules/user-prefs');
jest.mock('common/modules/analytics/register', () => ({
    begin: jest.fn(),
}));

describe('Message', () => {
    beforeEach(() => {
        if (document.body) {
            document.body.innerHTML = `
                <div id="header" class="l-header"></div>
                <div class="js-site-message is-hidden">
                    <div class="js-site-message-copy">...</div>
                    <button class="site-message__close"></button>
                </div>
                <div class="site-message--footer is-hidden js-footer-message">
                    <div class="site-message__copy js-footer-site-message-copy u-cf"></div>
                </div>'
            `;
        }
    });

    afterEach(() => {
        userPrefs.remove('messages');
    });

    it('Show a message', () => {
        new Message('foo').show('hello world');
        expect($('.js-site-message-copy').text()).toEqual('hello world');
        expect($('.js-footer-site-message-copy').text()).not.toEqual(
            'hello world'
        );
        expect($('.js-site-message').hasClass('is-hidden')).toEqual(false);
    });

    it('Show a pinnable message', () => {
        new Message('foo', { pinOnHide: true }).show('hello world');
        expect($('.js-site-message-copy').text()).toEqual('hello world');
        expect($('.js-footer-site-message-copy').text()).toEqual('hello world');
        expect($('.js-site-message').hasClass('is-hidden')).toEqual(false);
    });

    it('Hide a message', () => {
        const m = new Message('foo');
        m.show('hello world');
        m.hide();
        expect($('.js-site-message').hasClass('is-hidden')).toEqual(true);
        expect($('.js-footer-message').hasClass('is-hidden')).toEqual(true);
    });

    it('Hide a pinnable message', () => {
        const m = new Message('foo', { pinOnHide: true });
        m.show('hello world');
        m.hide();
        expect($('.js-site-message').hasClass('is-hidden')).toEqual(true);
        expect($('.js-footer-message').hasClass('is-hidden')).toEqual(false);
    });

    it('Remember the user has acknowledged the message', () => {
        const m = new Message('foo');
        m.acknowledge();
        expect(userPrefs.get('messages')).toEqual(['foo']);
        expect(m.hasSeen()).toEqual(true);
    });

    it('Block messages from overwriting each other', () => {
        const m1 = new Message('foo');
        const m2 = new Message('bar');
        m1.show('message one');
        m2.show('message two');
        expect($('.js-site-message-copy').text()).toEqual('message one');
    });

    it("Allow 'important' messages to overwrite an existing message", () => {
        const m1 = new Message('a');
        const m2 = new Message('b', { important: true });
        const m3 = new Message('c');
        m1.show('message one');
        m2.show('message two');
        m3.show('message three');
        expect($('.js-site-message-copy').text()).toEqual('message two');
    });

    it('has option to stay permanently open', () => {
        new Message('a', { permanent: true }).show('message one');
        expect($('.site-message__close').hasClass('is-hidden')).toEqual(true);
    });

    it('permanent message should have class added', () => {
        new Message('a', { permanent: true }).show('message one');
        expect($('.site-message--permanent').length).toEqual(1);
    });
});
