var envConfig = (function() {

    var envElement = document.getElementById('env'),
        env = 'local';

    if(envElement) {
        env = envElement.innerHTML;
    }

    var envConfig = {
        local: {
            env: env,
            apiURL: 'https://www.proptiger.com/',
            showLogs: true
        },
        dev: {
            env: env,
            apiURL: 'https://www.proptiger.com/',
            showLogs: true
        },
        qa: {
            env: env,
            apiURL: 'https://qa.proptiger-ws.com/',
            showLogs: true
        },
        qaui: {
            env: env,
            apiURL: 'https://qa-ui.proptiger-ws.com/',
            showLogs: true
        },
        beta: {
            env: env,
            apiURL: 'https://beta.proptiger-ws.com/',
            showLogs: true
        },
        prod: {
            env: env,
            apiURL: 'https://www.proptiger.com/',
            showLogs: false
        }
    };

    return envConfig[env];

})();
