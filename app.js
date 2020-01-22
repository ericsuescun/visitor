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

	res.header("Content-Type", "text/html; charset=utf-8");

	let nombre = req.query.name;
	let conteo = 0;

	if(!nombre || nombre.length === 0) {
		console.log('Va a crear un anónimo');
		Visitor.create({ name: 'Anónimo', count: 1 }, function(err, visitor) {
			if(err) {
				return console.error(err);
			} else {
				console.log('Crea: ' + visitor);
				render2();
			}
		});
	} else {
		Visitor.find({ name: nombre }, function(err, visitor) {
			if(err) {
				return console.error(err);
			} else {
				console.log('Visitor found: ' + visitor);
				if(visitor.length !== 0) {
					visitor[0].count = visitor[0].count + 1;
					console.log('Found name: ' + visitor[0].name);
					console.log('Visitor incremented to: ' + visitor[0].count);
					visitor[0].save(function(err, saved) {
						if(err) {
							return console.error(err);
						} else {
							render2();
						}
					});
				} else {
					Visitor.create({ name: nombre, count: 1 }, function(err) {
						console.log('New visitor saved');
						if(err) {
							return console.error(err);
						} else {
							render2();
						}
					});
				}
			}
		});	
	}

	function render2() {
		Visitor.find(function(err, visitors2) {
			if(err) {
				return console.error(err);
			} else {
				console.log('Rendering...');
				console.log('Array: ' + visitors2);
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
			}
		});
	}
})

app.listen(3000, console.log('Listening on port 3000!'));