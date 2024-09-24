import {NgxLoggerLevel} from 'ngx-logger';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    logLevel: NgxLoggerLevel.TRACE,
    serverLogLevel: NgxLoggerLevel.OFF,
    api_url: 'http://localhost:8080/api/',
    api_doc: 'http://localhost:8080/swagger-ui/',
    google: {
        clientId: '517151847301-i200k7o5tivqaitri8ri8j1obrjp0bd6.apps.googleusercontent.com'
    },
    facebook: {
        clientId: '464555957988601'
    }
};
