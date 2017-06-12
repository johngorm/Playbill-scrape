const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

//Const variable for host website to append to links
const scrape_web_home = 'http://www.playbill.com';
const PORT = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

app.get('/', function(req, res){

	request('http://www.playbill.com/news', function(error, response, html){
		
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
			$('div.bsp-list-promo-subtitle').each(function(i, element){

		    	let title = $(this).siblings().children('a').attr('title');
		    	let link = $(this).siblings().children('a').attr("href");
		    	let author = $(this).text();
		    	let imglink = $(this).parent().siblings().children().children().children().attr('src');
		    	scrape_result.push({
		    		title: title,
		    		link: scrape_web_home + link,
		    		author: author,
		    		imglink: imglink
		    	});

			});
			res.render('index', {newsLink : scrape_result});
		}

	});
});


app.listen(PORT, function(){
	console.log('Server listening on port ' + PORT);
});
