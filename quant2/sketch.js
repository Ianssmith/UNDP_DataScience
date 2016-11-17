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

var color = d3.scaleOrdinal()
    .range(["#ffc87c", "#ffeba8", "#f3b080", "#916800", "#dda66b"]);



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
		d.agval = +d.agval;
		d.elec = +d.elec;
		d.food = +d.food;
		d.foreign = +d.foreign;
		d.gdpcap = +d.gdpcap;
		d.gini = +d.gini;
		d.gdp = +d.gdp;
		d.percity = +d.percity;
		//d.pop = +d.pop;
		d.slum = +d.slum;
		d.sqkm = +d.sqkm;
	})	

var xscale = d3.scaleLinear().domain([0,50]).range([70,width+margin.right])

var yscale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.elec})).range([height-50,45])
var rMax = d3.max(data, function(d){var an = Math.sqrt(d.ag/Math.PI);console.log(an);return an})
console.log(Math.floor(rMax))
var rscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.ag})).range([80,15000])

var fullrMax = d3.max(data, function(d){var an = Math.sqrt(d.sqkm/Math.PI);console.log(an);return an})
console.log(Math.floor(fullrMax))
var fullrscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.sqkm})).range([80,15000])

var poprscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.pop})).range([80,15000])

var piescale = d3.scaleLinear().domain([0,100]).range([0,360])
var radscale = d3.scaleLinear().domain([0,360]).range([0,2*Math.PI])
//var cartxscale = 
//var cartyscale = d3.scaleLinear().domain(

var xAxis = d3.axisBottom(xscale)
	//.scale(x)
	//.orient("bottom");
var yAxis = d3.axisLeft(yscale)
	//.scale(y)
	//.orient("left");


	console.log(rscale(Math.sqrt(data.ag/Math.PI)))

	var div = d3.select("#fancy_chart").append("div")	
		.style("position","absolute")
		.attr("class", "tooltip")				
		.style("opacity", 0);


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
		.style("font-weight","bold")
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
		.style("font-weight","bold")
		.text("% of Population with access to electricity");

	var update = d3.select("svg").selectAll('g')
		.data(data).enter()
		.append('g');

	var pidiv = update.append("div")	
		.style("position","absolute")
		.attr("class", "pielabel")				
		.style("opacity", 0);

	update.append("circle")
		.attr("r", function(d,i){return Math.sqrt(rscale(d.ag)/Math.PI)})
		.attr("cx",function(d,i){return xscale(d.food)})
		.attr("cy", function(d,i){return yscale(d.elec)})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#FF4136"
			}else{
				//return "#0A294E"
				return "#001f3f"
			}
		})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#01FF70"
			}else{
				return "black"
			}})
		.style("opacity",0.5)
		.on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "white")
				.style("opacity", 0.9);
			div.html(d.Country_Name)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			pidiv.transition()
				.style("color", "white")
				.style("opacity", 0.9);
			pidiv.html(d.percity)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30)+ "px");

		})	
		.on("mouseout", function(){
			d3.select(this).transition()
			.style("opacity",0.5)
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#FF4136"
			}else{
				//return "#0A294E"
				return "#001f3f"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#01FF70"
			}else{
				return "black"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		update.selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.elec)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.elec)})
		update.selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.elec)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});

		update.on("click", function(d){
			
			d3.select(this)
				.append("line")
				.attr("class", "#persity")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.elec)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.elec)})
				.transition()
				.style("stroke", "white")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.elec)})
				.attr("x2",function(el,i){
					var ans = xscale(el.food)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
					return ans-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					return ans-Math.PI/4
					});

				d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.elec)})
					.style("fill", "white")
					.transition()
					.style("fill", "white")
					.text(function(el){return el.percity+"%"})
					.attr("x",function(el){
						var ans = xscale(el.food)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
						return ans-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
						return ans-Math.PI+15
						})

			d3.select(this)
				.append("line")
				.attr("class", "#slum")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.elec)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.elec)})
				.transition()
				.style("stroke", "#FFDC00")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.elec)})
				.attr("x2",function(el,i){
					var ans = xscale(el.food)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans-Math.PI/4
					})

				d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.elec)})
					.style("fill", "white")
					.transition()
					.style("fill", "darkgrey")
					.text(function(el){return el.slum+"%"})
					.attr("x",function(el){
						var ans = xscale(el.food)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans-Math.PI+15
						})
				
			d3.select(this).select("circle")
				.transition()
				.attr("r", function(el){return Math.sqrt(poprscale(el.pop)/Math.PI)})
				//.attr("startAngle", 0)
				//.attr("endAngle", Math.PI*2)
				.style("fill", "black");
		})
		;

		d3.select("#G").on("click", function(d){
			
		})
		function zoom(){

		}
		
}
