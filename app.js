const express = require('express');
const app = express();

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
	name: String,
	date: Date
});

var Visitor = mongoose.model("Visitor", schema);


app.get('/', (req, res) => {

	let nombre = req.query.name;
	let date = new Date();

	if(!nombre || nombre.length === 0) {
		nombre = 'Anónimo';
	}
	Visitor.create({ name: nombre, date: date }, function(err) {
		if(err) {
			return console.log(err);	
		} else {
			res.send(`<h1>El visitante de nombre: ${nombre} fue almacenado con éxito</h1>`);
		}
	});
})

app.listen(3000, console.log('Listening on port 3000!'));