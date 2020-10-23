var server = require('./app');
var port = process.env.PORT || 2000;
server.listen(port, function() {
    console.log('Server running on port: %d', port);
});