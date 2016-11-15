/*

d3.queue()
	.defer(d3.csv,"data/aglandsqkm.csv")
	.defer(d3.csv,"data/foodimport.csv")
	.defer(d3.csv,"data/electricity.csv")
	.await(analyze);


function analyze(error,ag,food,elec){
	if(error)console.log(error);

	console.log(ag)
	console.log(food)
	console.log(elec)

var data = [[],[],[]];
ag.forEach(function(d){
	d._2013 = +d._2013;
	data[0].push([d.Country_Name, d._2013]);
	})
food.forEach(function(d){
	d._2011 = +d._2011;
	data[1].push([d.Country_Name, d._2011 ]);
	})
elec.forEach(function(d){
	d._2012 = +d._2012;
	data[2].push([d.Country_Name, d._2011 ]);
	})
*/


var margin = {top: 40, right: 20, bottom: 20, left: 40},
	width = 1200 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;
	console.log(height)

d3.queue()
	.defer(d3.csv,"data/combined.csv")
	//.defer(d3.csv,"data/countrylists/asia.csv")
	//.defer(d3.csv,"data/countrylists/eucountries.csv")
	//.defer(d3.csv,"data/countrylists/northa.csv")
	//.defer(d3.csv,"data/countrylists/southAm.csv")
	.defer(d3.csv,"data/countrylists/groupcountries.csv")
	//.defer(d3.csv,"data/countrylists/notafrica.csv")
	//.defer(d3.csv,"data/countrylists/ssaCountries.csv")
	.await(analyze);

//analyze(error, data, asia, eu, na, sa, ssa, not)
function analyze(error, data, cont){
	if(error)console.log(error)

	data.forEach(function(d){
		for(var i =0;i<cont.length;i++){
			if(d.Country_Name == cont[i].Country_Name){
				d.Continent = cont[i].Continent;
			}
		}
	})

	console.log(data)

	data.forEach(function(d){
		d.ag = +d.ag;
		d.elec = +d.elec;
		d.food = +d.food;
	})	

var xscale = d3.scaleLinear().domain([0,50]).range([70,width+margin.right])

var yscale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.elec})).range([height-50,45])
var rMax = d3.max(data, function(d){var an = Math.sqrt(d.ag/Math.PI);console.log(an);return an})
console.log(Math.floor(rMax))
var rscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.ag})).range([2,5000])

var xAxis = d3.axisBottom(xscale)
	//.scale(x)
	//.orient("bottom");
var yAxis = d3.axisLeft(yscale)
	//.scale(y)
	//.orient("left");


	console.log(rscale(Math.sqrt(data.ag/Math.PI)))

	var svg = d3.select("#fancy_chart").append("svg")
		.attr("width", width+margin.right*2)
		.attr("height", height)
		.style("border", "0.5px dashed grey")
		.style("background", "lightgrey");

	//console.log(height)
	
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0,700)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "label")
		.attr("x",width/2)
		.attr("y",height -10)
		.style("text-anchor","middle")
		.text("Food Imports (as % of total merchandise imports)");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x",-200)
		.attr("y",30)
		.style("text-anchor","end")
		.text("% of Population with access to electricity");

	var update = d3.select("svg").selectAll('g')
		.data(data).enter()
		.append('g');


	update.append("circle")
		.attr("r", function(d,i){return Math.sqrt(rscale(d.ag)/Math.PI)})
		.attr("cx",function(d,i){return xscale(d.food)})
		.attr("cy", function(d,i){return yscale(d.elec)})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#FF4136"
			}else{
				return "#001f3f"
			}
		})
		.style("stroke-width", "2px")
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#01FF70"
			}else{
				return "black"
			}})
		.style("opacity",0.5)
		.on("mouseover", function(){
			d3.select(this).transition()
			.style("opacity",1.0)
			.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+2})
		})	
		.on("mouseout", function(){
			d3.select(this).transition()
			.style("opacity",0.5)
			.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		})
		;
		
}
