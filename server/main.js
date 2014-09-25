var redis = require('redis');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var getCode = require('./crockford.js');
var codeLength = 3;

// redis setup
var dbURL, db;
if (process.env.REDISCLOUD_URL) {
	dbURL = url.parse(process.env.REDISCLOUD_URL);
	db = redis.createClient(dbURL.port, dbURL.hostname, {no_ready_check: true});
	db.auth(dbURL.auth.split(":")[1]);
} else db = redis.createClient(); // 'redis://localhost:6379';

// express setup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = new express.Router({
	caseSensitive: false
});

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + "/../public");
app.set('view engine', 'jade');

router.use(express.static(__dirname + "/../public"));

router.route('/messages')
	.post(function (request, response, next) {
		var message = request.body.message;
		var code = getCode();
		var code32 = code.toString(36);

		db.set(code, message, function () {
			var _codeLength = code32.length;
			if (_codeLength !== codeLength) codeLength = _codeLength;
			response.redirect(code32);
		});
	});

router.route('/:message')
	.get(function (request, response, next) {
		// the passed in string
		var message = request.params.message;

		// if it could be a code
		if (message.length === codeLength) {
			// get the message in the right format
			var code = message.toLowerCase().replace('i', '1').replace('l', '1').replace('o', '0').replace('s', '5');

			db.get(parseInt(code, 36), function (error, reply) {
				// it's a code
				if (reply) message = reply;
				// it's not a code
				else message = message.replace(/-/g, ' ');

			 	response.render('index', {message: message});
			});
		} else {
			// it's not a code
			response.render('index', {message: message.replace(/-/g, ' ')});
		}
	})

app.use('/', router);
app.listen(app.get('port'));
