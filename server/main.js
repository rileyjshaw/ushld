var express = require('express');
var app = express();
var router = new express.Router({
	caseSensitive: false
});

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + "/../public");
app.set('view engine', 'jade');

router.use(express.static(__dirname + "/../public"));
router.route('/:message')
	.get(function (request, response, next) {
		var message = request.params.message.replace(/-/g, ' ');
		response.render('index', {message: message});
	});

app.use('/', router);
app.listen(app.get('port'));
