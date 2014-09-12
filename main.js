var express = require('express');
var app = express();
var router = new express.Router({
  caseSensitive: true
});

app.set('port', (process.env.PORT || 5000));

router.route('/:thing')
  .get(function (request, response, next) {
    var thing = request.params.thing;
    var message = 'You should';
    if (thing) message += ' ' + thing.replace(/-/g, ' ');
    response.send(message);
  });

app.use('/', router);
app.listen(app.get('port'));
