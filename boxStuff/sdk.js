var BoxSDK = require('box-node-sdk');
var config = require('config');



var sdk = new BoxSDK({
		clientID: config.get('boxAppSettings.clientID'),
		clientSecret: config.get('boxAppSettings.clientSecret'),
		appAuth: {
			keyID: config.get('boxAppSettings.appAuth.publicKeyID'),
			privateKey: config.get('boxAppSettings.appAuth.privateKey'),
			passphrase: config.get('boxAppSettings.appAuth.passphrase')
	}
});
//var jsonFromDeveloperConsole = require('../stuff.json');
//var sdk = BoxSDK.getPreconfiguredInstance(jsonFromDeveloperConsole);
//var client = sdk.getAppAuthClient('enterprise', process.env.enterpriseID);

//console.log(jsonFromDeveloperConsole);
module.exports = sdk;
