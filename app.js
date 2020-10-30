const express = require('express');
var app = express();
const path = require("path");
var bodyParser = require('body-parser');
const appRouter = require('./app/routes')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const router = express.Router();
app.use("/api", appRouter)
app.use(express.static(path.join(__dirname, 'dist/modelclassforangular'), {
	index: false
}));
// passport.authenticate(STRATEGY_NAME)
app.get('/', (req, res) => {
	console.log("req.originalUrl = ", req.originalUrl,"test2");
	res.sendFile(path.join(__dirname, 'dist/modelclassforangular/index.html'));
});
module.exports = app;
