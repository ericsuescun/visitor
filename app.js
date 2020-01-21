const express = require('express');
const app = express();

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-2', { useNewUrlParser: true });

mongoose.connection.on("error", function(e) { console.error(e); });

var schema = mongoose.Schema({
	name: String,
	count: Number
});

var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {

	let nombre = req.query.name;
	let conteo = 0;

	if(!nombre || nombre.length === 0) {
		nombre = 'Anonimo';
		conteo = 0;
	}
	
	Visitor.find({ name: nombre }, function(err, visitors) {
		if(err) return console.error(err);
		conteo = conteo + visitors.length;

		if(nombre === "Anonimo") {
			conteo = 0;
		}

		console.log('Creando... Nombre: ' + nombre + ' , conteo: ' + conteo);

		Visitor.create({ name: nombre, count: conteo + 1 }, function(err) {
			if(err) {
				return console.error(err);	
			} else {
				Visitor.find(function(err, visitors2) {
					if(err) return console.error(err);
					console.log(visitors2);
					res.write('<table>');
						res.write('<thead>');
							res.write('<tr>');
								res.write('<th>Id</th>');
								res.write('<th>Name</th>');
								res.write('<th>Visits</th>');
							res.write('</tr>');
						res.write('</thead>');
						res.write('<tbody>');
					visitors2.map((visitor, index) => {
							res.write('<tr>');
								res.write(`<td>${visitor._id}</td>`);
								res.write(`<td>${visitor.name}</td>`);
								res.write(`<td>${visitor.count}</td>`);
							res.write('</tr>');
					});
						res.write('</tbody>');
					res.write('</table>');
					res.end();
				});
			}
		});
	});

	// res.render('index', { visitors: allVisitors });

})

app.listen(3000, console.log('Listening on port 3000!'));