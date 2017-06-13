const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Article = require('./models/Article.js');
const Comment = require('./models/Comment.js');

//Const variable for host website to append to links
const scrape_web_home = 'http://www.playbill.com';
const scrape_url = 'http://www.playbill.com/news';
const PORT = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/playbill');
const db = mongoose.connection

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get('/scrape', function(req, res){

	request(scrape_url, function(error, response, html){
		
		if(error){
			throw error;
		}
		if(response.statusCode !== 200){
			if(response.statusCode === 404){
				console.error('ERROR: Website not found');
				res.status(404);	
				
			}
		}
		else{
			let $ = cheerio.load(html);
			let scrape_result = [];
			let count = 0;
			$('div.bsp-list-promo-subtitle').each(function(i, element){
				let result = {}

		    	result.title = $(this).siblings().children('a').attr('title');
		    	result.link = $(this).siblings().children('a').attr("href");
		    	result.author = $(this).text();
		    	
		    	let articleEntry = new Article(result);

		    	articleEntry.save((err, doc) =>{
		    		if(err){
		    			throw err;
		    		}
		    		else{
		    			count++;
		    			console.log(doc);
		    		}
		    	})

			});
			res.send(`${scrape_url} successfully scraped`);
		}

	});
});

app.get('/articles', function(req, res){
	Article.find({}, (err, results) =>{
		if(err){
			throw err;
		}
		else{
			res.render('index', {newsLink : results});
		}
	});
});

app.listen(PORT, function(){
	console.log('Server listening on port ' + PORT);
});
