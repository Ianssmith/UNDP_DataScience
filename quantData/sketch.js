

d3.csv("data/mergedData/data.csv", function(data){viz(data)});;

function viz(incomingData){
	console.log(incomingData);

	d3.selectAll("div")
		.data(incomingData)
		.enter()
		.append("div")
		.style("display", "inline-block")
		.style("padding", function(d){if(d.Area != null){return Math.sqrt(parseInt(d.Area)/100)+"px"}})
		.style("border", "1px solid red")
		.text(function(d){if(d.Area != ""){return d.Country_Name;}});
		//.style("height", function(d){return Math.sqrt(parseInt(d.Area)/1000)});
	//var Sat = d3.select("svg")
		//.style("background", "white")
		//.selectall("g")


	
}




/*
d3.queue()
  .defer(d3.csv, "/data/IMF/combanks.csv")
  .defer(d3.csv, "/data/countryinfo.csv")
  .await(analyze);

function analyze(error,banks,info){
	if(error) { console.log(error); }
	   
	console.log(banks)
	console.log(info)

	//console.log(d3.merge([banks,pop,size]));
	
	banks.forEach(function(country){
		var result = info.filter(function(sqkm){
			return sqkm["Country_Name"] === country["Country_Name"];
		});
		    //delete country.Country_Name;
			    country.SQKM = (result[0] !== undefined) ? result[0].sqkm : null;
	});
	console.log(banks);





}
*/
