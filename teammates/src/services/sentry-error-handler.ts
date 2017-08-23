import { IonicErrorHandler } from 'ionic-angular';
import {ErrorHandler} from '@angular/core';
import {AppConfig} from './app.config';
import Raven from 'raven-js';

Raven
    .config(AppConfig.SENTRY_CONFIG.dns)
    .install();

export class SentryErrorHandler extends IonicErrorHandler implements ErrorHandler {

    handleError(error) {
        console.debug('SentryErrorHandler::handleError -> ' + error);
        super.handleError(error);

        try {
            Raven.captureException(error.originalError || error);
        }
        catch(e) {
            console.error(e);
        }
    }
}
