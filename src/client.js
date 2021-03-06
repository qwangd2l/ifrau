'use strict';

var inherits = require('inherits');

var Promise = require('./promise-or-lie');

var Port = require('./port'),
	resizer = require('./plugins/iframe-resizer/client'),
	syncLang = require('./plugins/sync-lang/client'),
	syncIntl = require('./plugins/sync-intl/client'),
	syncTimezone = require('./plugins/sync-timezone/client'),
	syncTitle = require('./plugins/sync-title/client'),
	syncFont = require('./plugins/sync-font/client'),
	syncCssVariable = require('./plugins/sync-css-variable/client'),
	userActivityEvents = require('./plugins/user-activity-events/client');

function Client(options) {
	if (!(this instanceof Client)) {
		return new Client(options);
	}

	options = options || {};

	Port.call(this, window.parent, '*', options);

	if (options.syncLang !== false) {
		this.use(syncLang);
		this.use(syncIntl);
		this.use(syncTimezone);
	}
	if (options.syncTitle !== false) {
		this.use(syncTitle);
	}
	if (options.syncFont) {
		this.use(syncFont);
	}
	if (options.resizeFrame !== false) {
		this.use(resizer(options.resizerOptions));
	}
	if (options.syncCssVariable) {
		this.use(syncCssVariable);
	}
	this.use(userActivityEvents);
}
inherits(Client, Port);

Client.prototype.connect = function connect() {
	var me = this;

	return new Promise(function(resolve/*, reject*/) {
		me.open();
		me._sendMessage('evt', 'ready');

		resolve(Port.prototype.connect.call(me));
	});
};

module.exports = Client;
