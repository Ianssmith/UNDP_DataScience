//script to get articles about africa from the NYT api
var fs = require("fs")
var request = require("request")
var cheerio = require("cheerio")


var date = new Date();
var day = date.getDate();
var monthIndex = 1+date.getMonth();
if(monthIndex<10)monthIndex = "0"+ monthIndex;
var year = date.getFullYear();
		
var formdate = year + "" + monthIndex+ "" + day + ""

var apikey = process.env.NYTKEY
var input = 'africa'
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+input+"&begin_date=20151001&end_date="+formdate+"&sort=oldest&api-key="+apikey;


function searchArticles(){
	apiUrl = url;//url + input.value() + apiKey;
	request(apiUrl, gotJson); 
}

function gotJson(error,response,body){
	if(error)console.log(error);
	console.log(body)
	//var articles = data.response.docs;
	//console.log(articles);

}

//call function and pipe into nytarticles.json
searchArticles();
