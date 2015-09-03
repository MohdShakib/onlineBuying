var envConfig = (function() {

    var envElement = document.getElementById('env'),
        env = 'local';

    if(envElement) {
        env = envElement.innerHTML;
    }

    var envConfig = {
        local: {
            env: env,
            apiURL: 'https://www.proptiger.com/'
        },
        dev: {
            env: env,
            apiURL: 'https://www.proptiger.com/'
        },
        qa: {
            env: env,
            apiURL: 'https://qa.proptiger-ws.com/'
        },
        qaui: {
            env: env,
            apiURL: 'https://qa-ui.proptiger-ws.com/'
        },
        beta: {
            env: env,
            apiURL: 'https://beta.proptiger-ws.com/'
        },
        prod: {
            env: env,
            apiURL: 'https://www.proptiger.com/'
        }
    };

    return envConfig[env];

})();
