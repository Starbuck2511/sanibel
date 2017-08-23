import { IonicErrorHandler } from 'ionic-angular';
import {ErrorHandler} from '@angular/core';
import Raven from 'raven-js';

Raven
    .config('https://7f772648724248479f2ed99389ec532a@sentry.io/207329')
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
