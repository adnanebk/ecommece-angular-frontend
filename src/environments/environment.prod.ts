import {NgxLoggerLevel} from 'ngx-logger';

export const environment = {
    production: true,
    logLevel: NgxLoggerLevel.OFF,
    serverLogLevel: NgxLoggerLevel.ERROR,
    api_url: 'https://ang-shop.herokuapp.com/api/',
    api_doc: 'https://ang-shop.herokuapp.com/swagger-ui/',
    google: {
        clientId: '517151847301-i200k7o5tivqaitri8ri8j1obrjp0bd6.apps.googleusercontent.com'
    },
    facebook: {
        clientId: '464555957988601'
    }
};
