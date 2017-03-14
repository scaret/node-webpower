var WebPowerWSDL_4_2 = require("./WebPowerWSDL_4_2");

function WebPowerAPI(options){
    if (!options){
        throw new Error('You have to provide options for this to work.');
    }
    if (!options.username){
        throw new Error('You have to provide username for this to work.');
    }
    if (!options.password){
        throw new Error('You have to provide password for this to work.');
    }
    return new WebPowerWSDL_4_2(options);
}

module.exports = WebPowerAPI;