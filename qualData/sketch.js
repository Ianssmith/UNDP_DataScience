//stopwords http://www.ranks.nl/stopwords

//import text and stopwords file
var q  = d3.queue();

	q.defer(d3.text,"data/qual/reporttext.txt")
	.defer(d3.text,"mysqlstopw.txt")
	//.defer(d3.json,"nytarticels.json")
	.await(analyze);

//function getText(error, data, stopw, nyt){
//	if(error){console.log(error);}
//
//	for(var i=0;i<articles.length;i++){
//		q.defer(d3.html(articles[i].web_url))
//	}
//
//	q.awaitAll(analyze);	
//		
//}


function analyze(error, data ,stopw, nyt){
	if(error){console.log(error);}

	//console.log(data)

	d3.select('body')
		.style("max-width","800px")
		.style("max-height","600px");

	data.replace(/[0-9]/,"")
	data.replace(/\s/,"")
	data.replace("↵", "")
	data.trim()	

//seperate text into word array and make first letter upper case
	var temp = data.split(/ +/);		
	var datarray = [];
		for(var i=0;i<temp.length;i++){
			datarray[i] = temp[i].charAt(0).toUpperCase() + temp[i].substr(1).toLowerCase();	
		}

//add context
	d3.select("#chart").insert("p")
		.text("UN Development Programme--Growth, Poverty and Inequality Interactions In Africa:An Overview of Key Issues (30.June.2016) Total word count:"+ datarray.length)
		.style("font-size", "30px")
		.style("font-family","Helvetica")
		.style("font-weight", "Bold")
		.style("margin-top", "100px")
		.style("position", "absolute")
		.style("color","#111111");

	//console.log(datarray);

	var stopwarr = stopw.split(/\n/);
	//console.log(stopwarr)

//cycle and remove stop words from text
	var checker = 0;
	var  i=0;
	while(checker <=datarray.length){
		for(i=0;i<stopwarr.length;i++){
		if(datarray[checker] == stopwarr[i]){
			datarray.splice(checker,1)	
			i=0;
		}
		}
checker++;
	}

//create hash table array
	console.log(datarray.length)
	var hasharr = [];
	for(var k in datarray){
			if(hasharr[datarray[k]] >=1)
				hasharr[datarray[k]] += 1;
			else
				hasharr[datarray[k]] = 1;
		}
	var sorted = [];
	
	for(var key in hasharr){
		sorted.push([[key], hasharr[key]]);
		sorted.sort(function(a,b){
			a = a[1];
			b = b[1];

			return a<b ? 1:(a>b ? -1:0)
		})
	}
	//console.log(sorted)

//create hash counts for the amounts of word occurences
	var hashhash = [];
	for(var k in sorted){
			if(hashhash[sorted[k][1]] >=1)
				hashhash[sorted[k][1]] += 1;
			else
				hashhash[sorted[k][1]] = 1;
		}
		//console.log(hashhash)
	var sortedhash = [];
	for(var key in hashhash){
		//console.log([key])
		sortedhash.push([key]);///because javascript...
	}
	//console.log(sortedhash)//???? 
	//console.log(sortedhash[0])
	//console.log(sorted)
	
//filter out repetitions and sort into count-bins with words in their respective bins
	var check2 = 0;
	var k=0;
	while(check2 <sorted.length){
	for(var k=0;k<sortedhash.length;k++){
		if(sorted[check2][1]+"" == sortedhash[k][0]){
			sortedhash[k].push(sorted[check2][0][0])// += ":" + sorted[check2][0][0]//.splice(check2,1,0))
			//sorted.splice(check2,1,0)
			//k=0;
		}
		}
		check2++;
	}

	//console.log(sortedhash);

//function to check for keywords
function checkWord(arr){
	return arr === "________Electricity________" || arr === "________Agriculture________"
}

//create viz
		d3.select("body").selectAll("div")
			.data(sortedhash).enter()
			.insert("div")
			.attr("id",function(d,i){return "#wordgroup"+i})
			.style("display", "inline-block")
			.text(function(d){
				if(+d[0]>=5){
					for(var j=0;j<d.length;j++){
						if(d[j] == "Electricity" || d[j] === "Agriculture") d.splice(j,1,"________"+d[j]+"________")
					}
				
				return d+" <<<\n"
			}})
			.style("background-color","#FF4136")
			.style("font-weight","bold")
			.style("font-family","helvetica")
			.style("font-size",function(d,i){return +d[0]+7 +"px"})
			.style("color",function(d){
				if(d.some(checkWord)) {return "#dddddd"}else
				{return "#111111"}
			})
			.style("padding", "10px");
	
};

