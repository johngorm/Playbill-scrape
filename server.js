const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Article = require('./models/Article.js');
const Comment = require('./models/Comment.js');



//Const variable for host website to append to links
const scrape_web_home = 'http://www.playbill.com';
const scrape_url = 'http://www.playbill.com/news';
const PORT = process.env.PORT || 3000;

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
//Allow app use of method override so we can change articles "favorite" status
app.use(methodOverride("_method"));
app.use(express.static("./public"));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/playbill');
const db = mongoose.connection;

mongoose.Promise = Promise;

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
			$('div.bsp-list-promo-subtitle').each(function(i, element){
				let result = {}

		    	result.title = $(this).siblings().children('a').attr('title');
		    	result.link = $(this).siblings().children('a').attr("href");
		    	result.author = $(this).text();
		    	
		    	Article.findOne(result, (error, news_article) =>{
		    		if(error){
		    			throw err;
		    		}
		    		else if(!news_article){
		    			
		    			let articleEntry = new Article(result);
				    	articleEntry.save((err, doc) =>{
				    		if(err){
				    			throw err;
				    		}
				    		else{
				    			
				    			console.log(doc);
				    		}
				    	});
		    		}
		    	});
			});
			res.send(`${scrape_url} successfully scraped`);
		}

	});
});

app.get('/favorites', function(req, res){
	Article.find({"saved" : true}).exec((error, results) =>{
		if(error){
			throw error;
		}
		else{
			res.render('index', {newsLink : results})
		}
	})
})

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

app.get('/articles/:id', function(req, res){
	Article.findOne({ "_id" : mongoose.Types.ObjectId(req.params.id)})
	.populate('comment')
	.exec(function(error, doc){
		if(error){
			throw error;
		}
		else{
			console.log(doc);
			
			res.send(doc);
		}
	});
});

app.post('/articles/:id', (req, res) =>{
	
	
	let newComment = new Comment(req.body);

	newComment.save((err, doc) =>{
		if(err){
			throw err;
		}
		else{
			console.trace(doc);
			Article.findOneAndUpdate({"_id" : req.params.id}, {$push: {"comment" : doc._id}})
			.exec(function(error, article){
				if(error){
					throw error;
				}
				else{
					console.trace(article.comment);
					res.send(article);
				}
			})
		}
	});
});

//Create route to save 
app.put('/articles/:id', (req, res) =>{
	
	Article.findOne({"_id" : mongoose.Types.ObjectId(req.params.id)},'saved').exec((err, doc) =>{
		if(err){
			throw err;
		}
		else{
		
			let newSaveState = !doc.saved;
		
			Article.update({"_id" : req.params.id}, {'saved': newSaveState}, (err, result) =>{
				if(err){
					throw err;
				}
				else{
					
					res.redirect("/articles");
				}
			});

		}
	});
});


app.all('/articles/:id', function(req, res, next){
	console.log('Return to home page');

})



app.listen(PORT, function(){
	console.log('Server listening on port ' + PORT);
});
