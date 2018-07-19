'use strict';

const _ = require('lodash');
const q = require('q');
const NewBrowser = require('lib/browser/new-browser');
const ExistingBrowser = require('lib/browser/existing-browser');

function createBrowserConfig_(opts = {}) {
    const browser = _.defaults(opts, {
        desiredCapabilities: {browserName: 'browser'},
        baseUrl: 'http://base_url',
        gridUrl: 'http://test_host:4444/wd/hub',
        waitTimeout: 100,
        screenshotPath: 'path/to/screenshots',
        httpTimeout: 3000,
        sessionRequestTimeout: null,
        sessionQuitTimeout: null,
        screenshotOnReject: true,
        screenshotOnRejectTimeout: 3000,
        screenshotDelay: 0,
        windowSize: null,
        getScreenshotPath: () => '/some/path',
        system: opts.system || {}
    });

    return {
        baseUrl: 'http://main_url',
        gridUrl: 'http://main_host:4444/wd/hub',
        system: {debug: true},
        forBrowser: () => browser
    };
}

exports.mkNewBrowser_ = (opts) => {
    return NewBrowser.create(createBrowserConfig_(opts), 'browser');
};

exports.mkExistingBrowser_ = (opts) => {
    return ExistingBrowser.create(createBrowserConfig_(opts), 'browser');
};

exports.mkSessionStub_ = () => {
    const session = q();
    session.init = sinon.stub().named('init').returns(session);
    session.end = sinon.stub().named('end').resolves();
    session.url = sinon.stub().named('url').returns(session);
    session.execute = sinon.stub().named('execute').resolves({});
    session.windowHandleSize = sinon.stub().named('windowHandleSize').resolves({value: {}});
    session.requestHandler = {defaultOptions: {}};
    session.screenshot = sinon.stub().named('screenshot').resolves({value: {}});

    session.addCommand = sinon.stub().callsFake((name, command) => {
        session[name] = command;
        sinon.spy(session, name);
    });

    return session;
};