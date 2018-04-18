var express = require('express');
var router = express.Router();
var assert = require('assert');
var fs = require('fs');
//var module = require('../modules/module.js');
var User = require('../models/user');
var Game = require('../models/game');
var Test = require('../models/test');

/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.errors = null;
  res.render('index', {user: req.session.user });
});

router.get('/register', function(req, res, next) {

		if(!req.session.userId){
			var err_msg = req.session.reg_msg;
			delete req.session.reg_msg;
			res.render('register', { 
				error: err_msg,
				firstname: req.session.firstname,
				lastname: req.session.lastname,
				email: req.session.email
			});
			
		}
		else{
			delete req.session.reg_msg;
			res.redirect('/profile');
		}
  		
});


router.get('/login', function(req, res, next) {

		if(!req.session.userId){
			var err_msg = req.session.log_msg;
			delete req.session.log_msg;
			res.render('login', { error: err_msg });
		}
		else{
			delete req.session.log_msg;
			res.redirect('/profile');
		}
});


router.post('/registerUser', function(req, res, next){

	req.session.firstname =  req.body.firstname;
	req.session.lastname =  req.body.lastname;
	req.session.email =  req.body.email;

	if(req.body.firstname && req.body.lastname && req.body.email &&req.body.pass && req.body.pass_conf){
		if (req.body.pass === req.body.pass_conf) {
	   		if(req.body.pass.length>=6){
			    var userData = {
					firstname:req.body.firstname,
					lastname:req.body.lastname,
					email:req.body.email,
					password:req.body.pass,
					passwordConf:req.body.pass_conf,
					admin: false
				}

				User.create(userData, function (err, user) {
				    if (err) {
		      			req.session.reg_msg = "Даний e-mail адрес використаний для іншого користувача";
		            	res.redirect("/register");
				      return next(err)
				    } else {
				    	console.log(user._id);
				    	req.session.userId = user._id;
				    	req.session.user = user;
				    	delete req.session.reg_msg;
				    	return res.redirect("/profile");
				      //return res.redirect('/profile');
				    }
				});
			}else{
				req.session.reg_msg = "Пароль повинен містити хоч 6 символів";
				res.redirect("/register");
			}
		}else{
			req.session.reg_msg = "Паролі не співпадають";
			res.redirect("/register");
		}
  	}else{
			req.session.reg_msg = "Заповніть всі поля"; 
			res.redirect("/register");
		}		
});


router.post('/loginUser', function(req, res, next){

	User.authenticate(req.body.email, req.body.pass, function (error, user) {
      if (error || !user) {
        req.session.log_msg = "Не вірний e-mail або пароль";
        res.redirect('/login');
        //return res.send('Not logged in!');
        //return next(err);
      } else {
        req.session.userId = user._id;
        req.session.user =  user;
        if(user.admin){
        	req.session.admin = true;
        }
        return res.redirect('/profile');
      }

	})
});

router.get('/profile', function (req, res, next) {
  		
	if(req.session.userId){

		var user_tests= [];
		Test.find({}).exec(function(err, tests){

			tests.forEach(function(elem){
				for(var i = 0; i<elem.results.length; i++){
					
					if(elem.results[i].user == req.session.userId){
						console.log(elem._id);
						var obj = {
							id: elem._id,
							img: elem.img,
							name: elem.name,
							res: elem.results[i]
						}

						user_tests.push(obj);
					}
				}
			});
			res.render('profile', {tests: user_tests, user: req.session.user});
		});
	}else{
		res.render('profile', {tests: user_tests, user: req.session.user});
	}

});


router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.get('/getTest', function (req, res, next) {
	var allGames = [];
	Game.find({},function(err, games){
		games.forEach(function(game){
			allGames.push(game);
		});
		res.send(allGames);
	});
});

router.get('/tests', function (req, res, next) {
	var allTests = [];

	Test.find({},function(err, games){
		games.forEach(function(game){
			allTests.push(game);
		});

		res.render('tests', {tests: allTests, admin: req.session.admin});
	});
});


router.get('/tests/:id', function (req, res, next) {
	
	if(!req.session.userId){
		res.redirect("/login")
		req.session.errors = null;
	}
	else{

		
		Test.find({$and: [ {_id:req.params.id}, {"results.user": req.session.userId}] },function(err, user){
			if(user.length==0){
				res.render("testPage");
			}else{
			
					//res.redirect('/tests');
				res.redirect('/results/'+req.params.id);
			}
		});
	}
});

router.get('/results/:id', function(req, res, next) {

	var one_result;
	Test.findOne({$and: [ {_id:req.params.id}, {"results.user": req.session.userId}]}).populate('results.user').exec(function(err, results){

		if(results){
			var all_results = results.results;
			for(var i = 0; i < all_results.length; i++){
				if(all_results[i].user._id == req.session.userId){
					one_result = all_results[i];break;
				}
			}
			
			var date = getDateString(one_result.date);		
			res.render("results",{ result: one_result, date: date});
		}else{
			res.redirect("/tests/"+req.params.id);
		}

	});	
});


router.get('/getCurrentTest', function(req, res, next){

	const str = req.query.id;
	const id = str.substring(str.lastIndexOf("/")+1);

	var test;
	Test.find({_id:id}).populate("games.game").exec( function(err, tests){
		test = tests[0];
		res.send(test);
	});
});


router.get('/getGame', function (req, res, next){

	const game_link = req.query.link;
	console.log(game_link);
	fs.readFile('files/'+game_link+'.html', function(err, data) {
		res.send(data);
	});
});


router.post('/postResult', function(req, res, next){

	var user_id = req.session.userId;
		
	const str = req.body.id;
	const test_id = str.substring(str.lastIndexOf("/") + 1);
	console.log("Test id " + test_id);
	var to_push={ };

	to_push.test_res =  JSON.parse(req.body.result);
	to_push.user = user_id;
	to_push.date = (+ new Date());


	Test.update({ _id: test_id }, { "$pull": { "results": { "user": user_id} }}, { safe: true, multi:true }, function(err, obj) {
    	
		Test.findOneAndUpdate({_id:test_id}, { 
    	$push:{results: to_push}
     }, function (err, place) {
  		
  		res.send("/results/"+test_id);
	});

	});

});

//////////------------------ADMIN PAGE ROUTES-------------------------//////////////////


router.get('/admin-page', function(req, res, next){


	if(req.session.userId){
		User.findOne({"_id": req.session.userId}, function(err, user){
			if(user.admin){
				res.render("admin_page",{access: true});
				//true
			}else{

				res.render("admin_page",{access: false});
				//access denied
			}
		})
	}else{
		res.redirect('/login');
	}

});


router.get('/admin-page/test-results', function(req, res, next){



	if(!req.session.test_search_name){
		Test.find({}).populate("results.user").populate("games.game").exec(function(err, tests){
			res.render('tests_results',{tests: tests,  search: ""});
		});
	}else{
		Test.find({"name": {$regex:".*"+req.session.test_search_name+".*"}}).populate("results.user").populate("games.game").exec(function(err, tests){
			var search_name = req.session.test_search_name;
			delete req.session.test_search_name;
			res.render('tests_results',{tests: tests, search: search_name});
		});
	}
});


router.get('/admin-page/result/:id', function(req, res, next){

	var condition = req.session.condition || "points";
	delete req.session.condition;

	Test.findOne({"_id": req.params.id}).populate("results.user").exec(function(err, test){


		if(condition=="points"){
			test.results.sort(function(a,b){
				 return b["test_res"][condition] - a["test_res"][condition]; 
			});
		}else{
			test.results.sort(function(a,b){
				 return a["test_res"][condition] - b["test_res"][condition]; 
			});
		}

		res.render("user-results",{test: test, condition:condition});
	});
});


router.get('/create-test', function(req, res, next){
	var all_games = [];

	Game.find({}, function(err, games){

		games.forEach(function(item){
			all_games.push(item);
		})

		res.render("create-test", {games: all_games});
	})

});


router.post('/postTest', function(req, res, next){


	var test = {
		name:  req.body.name,
		img:  req.body.img,
		description: req.body.desc,
		games:  JSON.parse(req.body.games)
	}

	Test.create(test);

	if(req.body.imgBase64){
		var data_url = req.body.imgBase64;
	    var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
	    var ext = matches[1];
	    var base64_data = matches[2];
	    var buffer = new Buffer(base64_data, 'base64');

	    fs.writeFile('public/images/logo/'+ req.body.img, buffer, function (err) {
	        console.log('done');
	    });
	 }
});

router.get('/sort_res', function(req, res, next){
	req.session.condition = req.query.condition;
	const str = req.query.id;
	const test_id = str.substring(str.lastIndexOf("/") + 1);
	res.send('/admin-page/result/'+ test_id);

});


router.post('/searchTest', function(req, res, next){
	req.session.test_search_name = req.body.search;
	res.redirect("/admin-page/test-results");
});


function getDateString (timestamp){

	var d = new Date(timestamp);
	return d.toDateString();
}


module.exports = router;
