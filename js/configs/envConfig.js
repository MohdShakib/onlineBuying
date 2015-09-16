var envConfig = (function() {

    var envElement = document.getElementById('env'),
        env = 'local';

    if(envElement) {
        env = envElement.innerHTML;
    }

    var envConfig = {
        local: {
            env: env,
            protocol: 'http://',
            apiURL: 'www.proptiger.com/',
            showLogs: true
        },
        dev: {
            env: env,
            protocol: window.location.protocol + '//',
            apiURL: 'www.proptiger.com/',
            showLogs: true
        },
        qa: {
            env: env,
            protocol: window.location.protocol + '//',            
            apiURL: 'qa.proptiger-ws.com/',
            showLogs: true
        },
        qaui: {
            env: env,
            protocol: window.location.protocol + '//',            
            apiURL: 'qa-ui.proptiger-ws.com/',
            showLogs: true
        },
        beta: {
            env: env,
            protocol: window.location.protocol + '//',            
            apiURL: 'beta.proptiger-ws.com/',
            showLogs: true
        },
        prod: {
            env: env,
            protocol: window.location.protocol + '//',            
            apiURL: 'www.proptiger.com/',
            showLogs: false
        }
    };

    return envConfig[env];

})();
