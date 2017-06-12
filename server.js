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



app.get('/', function(req, res){

	request('http://www.playbill.com/news', function(error, response, html){
		if(error){
			res.send('Unable to scrape website');
		}
		else{
			let $ = cheerio.load(html);
			let scrape_result = [];
			$('div.bsp-list-promo-subtitle').each(function(i, element){

		    	let title = $(this).siblings().children('a').attr('title');
		    	let link = $(this).siblings().children('a').attr("href");
		    	let imglink = $(this).parent().siblings().children().children().children().attr('src');

		    	scrape_result.push({
		    		title: title,
		    		link: scrape_web_home + link,
		    		imglink: imglink
		    	});

			});
			res.json(scrape_result);
		}

	});
});


app.listen(PORT, function(){
	console.log('Server listening on port ' + PORT);
});
