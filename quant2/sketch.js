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

var G = d3.select("#G")
var S = d3.select("#S")
//var E = d3.select("#E")
var gdpc = d3.select("#gdpc")
var landa = d3.select("#landa")


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
		d.gdpcap = +d.gdpcap;
		d.percity = +d.percity;
		//d.pop = +d.pop;
		d.slum = +d.slum;
		d.sqkm = +d.sqkm;
	})	

//var xscale = d3.scaleLinear().domain([0,50]).range([70,width+margin.right])
//var xscale = d3.scaleLinear().domain([0,1000000]).range([70,width+margin.right])
var xscale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.food})).range([100,width-margin.right*2])

var yscale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.slum})).range([height-70,45])
var giniscale = d3.scaleLinear().domain(d3.extent(data, function(d){return d.gini})).range([height-70,45])
//var yscale = d3.scaleLinear().domain([0,1585000000000]).range([height-50,45])
//var yscale = d3.scaleLinear().domain([0,55000]).range([height-50,45])
var rMax = d3.max(data, function(d){var an = Math.sqrt(d.ag/Math.PI);console.log(an);return an})
console.log(Math.floor(rMax))
var rscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.ag})).range([30,10000])

var fullrMax = d3.max(data, function(d){var an = Math.sqrt(d.gdpcap/Math.PI);console.log(an);return an})
console.log(Math.floor(fullrMax))
var fullrscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.gdpcap})).range([30,10000])

var poprscale = d3.scaleLinear().domain(d3.extent(data, function(d){
	return d.gdpcap})).range([30,10000])

var piescale = d3.scaleLinear().domain([0,100]).range([0,360])
var radscale = d3.scaleLinear().domain([0,360]).range([0-Math.PI/2,Math.PI/2+Math.PI])
//var cartxscale = 
//var cartyscale = d3.scaleLinear().domain(

var xAxis = d3.axisBottom(xscale)
	//.scale(x)
	//.orient("bottom");
var yAxis = d3.axisLeft(yscale)
	//.scale(y)
	//.orient("left");

/*
^^^^^^^^^^^^^^^ SCALING and INIT ^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv UI and TOOLTIPS vvvvvvvvvvvvvvvvv
*/
////svg canvas and boreder vv
	console.log(rscale(Math.sqrt(data.ag/Math.PI)))

	var div = d3.select("#fancy_chart").append("div")	
		.style("position","absolute")
		.attr("class", "tooltip")				
		.style("opacity", 0);


	var svg = d3.select("#fancy_chart").append("svg")
		.attr("width", width+margin.right*2)
		.attr("height", height)
		//.style("border", "0.5px dashed grey")
		.style("padding", "100px")
		.style("background", "white");

////svg canvas and boreder ^^
	//console.log(height)
	
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0,680)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "xlabel")
		.attr("x",width/2)
		.attr("y",height -5)
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Food Imports (as % of Imported Merchandise)");
		//.text("Food Imports (as % of total merchandise imports)");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "ylabel")
		.attr("transform", "rotate(-90)")
		.attr("x",-120)
		.attr("y",30)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("% of Urban Population Living in Slums");


////axes ^^^^

	var update = d3.select("svg").style("padding-bottom","0px").style("margin-bottom","0px").selectAll('g')
		.data(data).enter()
		.append('g')
		;

	var pidiv = update.append("div")	
		.style("position","absolute")
		.attr("class", "pielabel")				
		.style("opacity", 0);


/*
^^^^^^^^^^^^^^^ UI and TOOLTIPS ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv INITIAL RENDER vvvvvvvvvvvvvvvvvv
*/


	update.append("circle")
		.attr("r", function(d,i){
			if(d.food == 0){
				return 0
			}else{
			return Math.sqrt(rscale(d.ag)/Math.PI)
			}		
		})
		.attr("class", "landarea")
		.attr("cx",function(d,i){return xscale(d.food)})
		.attr("cy", function(d,i){return yscale(d.slum)})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.style("stroke", function(d){
			if(d.elec == 100){
				return "#fcc30b"
			}else{
				return "#222222"
			}})
//			}else
//			 if(d.ag >100000){
//				return "#56c02b"
//			}else{
//				return "#222222"
//			}})
		.style("opacity",0.75)
/*
^^^^^^^^^^^^^^^ INITIAL RENDER ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv POINT SWELL ANIME vvvvvvvvvvvvvvvvvv
*/
		.on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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


/*
^^^^^^^^^^^^^^^ POINT SWELL ANIME ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv LAND AREA BUTTON FUNCTION vvvvvvvvvvvvvvvvvv
*/

		landa.on("click", function(){
			//d3.select(this).transition()
			update.selectAll("circle")
			.attr("class", "landarea")
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.slum)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});


		//update.selectAll(".landarea").selectAll("circle").on("mouseout", function(){
		update.selectAll(".landarea").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.slum)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});

/*
^^^^^^^^^^^^^^^ LAND AREA BUTTON FUNCTION ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv GDPCAP vvvvvvvvvvvvvvvvvv
*/

		gdpc.on("click", function(d){
			//d3.select(this)
			update.selectAll("circle")
				.attr("class", ".gdpcapita")
				.append("line")
				.attr("class", ".mark")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "white")
				.style("opacity", "0.5")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return Math.sqrt(yscale(poprscale(el.gdpcap)/Math.PI))*(Math.sin(radscale(0)))})

				/*d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.elec)})
					.style("fill", "white")
					.transition()
					.style("fill", "lightgrey")
					.style("opacity", "0.5")
					.text("0%")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y", function(el,i){
					.attr(return yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					});
					*/
			
			//d3.select(this)
			d3.selectAll("circle")
				.append("line")
				.attr("class", "#persity")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "white")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){
					var ans = xscale(el.food)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					});

				//d3.select(this).append("text")
				d3.selectAll("circle").append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.slum)})
					.style("fill", "white")
					.transition()
					.style("fill", "white")
					.text(function(el){return el.percity+"%"})
					.attr("x",function(el){
						var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
						return ans//-Math.PI+15
						})

/*
			d3.select(this)
				.append("line")
				.attr("class", "#slum")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "#FFDC00")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){
					var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})

				d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.slum)})
					.attr("y",function(el,i){return yscale(el.gdpcap)})
					.style("fill", "white")
					.transition()
					.style("fill", "darkgrey")
					.text(function(el){return el.slum+"%"})
					.attr("x",function(el){
						var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans//-Math.PI-15
						})
					*/
				
			//d3.select(this).select("circle")
			d3.selectAll("circle")
				.transition()
				.attr("r", function(el){return Math.sqrt(poprscale(el.gdpcap)/Math.PI)})
				//.attr("startAngle", 0)
				//.attr("endAngle", Math.PI*2)
				.style("fill", function(d){
					if(d.Continent == "Africa"){
						return "#e5243b"
					}else{
						return "#19486a"}});
		})

		d3.selectAll("circle").selectAll(".gdpcapita").on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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
		;

		S.on("click", function(d){
			//console.log("it works")	

d3.selectAll("circle").remove()
d3.selectAll(".y_axis").remove()
d3.selectAll(".label").remove()
d3.selectAll(".ylabel").remove()
d3.selectAll(".xlabel").remove()


////axes vvvv
	
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0,680)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "xlabel")
		.attr("x",width/2)
		.attr("y",height -5)
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Food Imports (as % of Imported Merchandise)");
		//.text("Food Imports (as % of total merchandise imports)");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "ylabel")
		.attr("transform", "rotate(-90)")
		.attr("x",-120)
		.attr("y",30)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("% of Urban Population Living in Slums");


////axes ^^^^

/*
^^^^^^^^^^^^^^^ UI and TOOLTIPS ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv INITIAL RENDER vvvvvvvvvvvvvvvvvv
*/


	update.append("circle")
		.attr("r", function(d,i){
			if(d.food == 0){
				return 0
			}else{
			return Math.sqrt(rscale(d.ag)/Math.PI)
			}		
		})
		.attr("class", "landarea")
		.attr("cx",function(d,i){return xscale(d.food)})
		.attr("cy", function(d,i){return yscale(d.slum)})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.style("stroke", function(d){
			if(d.elec == 100){
				return "#fcc30b"
			}else{
				return "#222222"
			}})
		//	}else 
//			if(d.ag >100000){
//				return "#56c02b"
//			}else{
//				return "#222222"
//			}})
		.style("opacity",0.75)
/*
^^^^^^^^^^^^^^^ INITIAL RENDER ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv POINT SWELL ANIME vvvvvvvvvvvvvvvvvv
*/
		.on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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


/*
^^^^^^^^^^^^^^^ POINT SWELL ANIME ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv LAND AREA BUTTON FUNCTION vvvvvvvvvvvvvvvvvv
*/

		landa.on("click", function(){
			//d3.select(this).transition()
			update.selectAll("circle")
			.attr("class", "landarea")
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.slum)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});


		//update.selectAll(".landarea").selectAll("circle").on("mouseout", function(){
		update.selectAll(".landarea").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.slum)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});

/*
^^^^^^^^^^^^^^^ LAND AREA BUTTON FUNCTION ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv GDPCAP vvvvvvvvvvvvvvvvvv
*/

		gdpc.on("click", function(d){
			//d3.select(this)
			update.selectAll("circle")
				.attr("class", ".gdpcapita")
				.append("line")
				.attr("class", ".mark")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "white")
				.style("opacity", "0.5")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return Math.sqrt(yscale(poprscale(el.gdpcap)/Math.PI))*(Math.sin(radscale(0)))})

				/*d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.elec)})
					.style("fill", "white")
					.transition()
					.style("fill", "lightgrey")
					.style("opacity", "0.5")
					.text("0%")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y", function(el,i){
					.attr(return yscale(el.elec)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					});
					*/
			
			//d3.select(this)
			d3.selectAll("circle")
				.append("line")
				.attr("class", "#persity")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "white")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){
					var ans = xscale(el.food)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					});

				//d3.select(this).append("text")
				d3.selectAll("circle").append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.slum)})
					.style("fill", "white")
					.transition()
					.style("fill", "white")
					.text(function(el){return el.percity+"%"})
					.attr("x",function(el){
						var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
						return ans//-Math.PI+15
						})

/*
			d3.select(this)
				.append("line")
				.attr("class", "#slum")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.slum)})
				.transition()
				.style("stroke", "#FFDC00")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.slum)})
				.attr("x2",function(el,i){
					var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})

				d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.slum)})
					.attr("y",function(el,i){return yscale(el.gdpcap)})
					.style("fill", "white")
					.transition()
					.style("fill", "darkgrey")
					.text(function(el){return el.slum+"%"})
					.attr("x",function(el){
						var ans = xscale(el.slum)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.slum)/100)*100/el.pop))));
						return ans//-Math.PI-15
						})
					*/
				
			//d3.select(this).select("circle")
			d3.selectAll("circle")
				.transition()
				.attr("r", function(el){return Math.sqrt(poprscale(el.gdpcap)/Math.PI)})
				//.attr("startAngle", 0)
				//.attr("endAngle", Math.PI*2)
				//.style("fill", "black");
				.style("fill", function(d){
					if(d.Continent == "Africa"){
						return "#e5243b"
					}else{
						return "#19486a"}});
		})
		d3.selectAll(".gdpcapita").on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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
		;
		})
/*
^^^^^^^^^^^^^^^ GDPCAP  ^^^^^^^^^^^^^^^





// Alternative Y Axes





vvvvvvvvvvvvvvv CHANGE Y TO GINI  vvvvvvvvvvvvvvvvvv
*/
		//d3.select("#G").on("click", function(d){
		G.on("click", function(d){
			//console.log("it works")	

d3.selectAll("circle").remove()
d3.selectAll(".y_axis").remove()
d3.selectAll(".label").remove()
d3.selectAll(".ylabel").remove()
d3.selectAll(".xlabel").remove()

/////redo axes


	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0,680)")
		.call(xAxis);

	svg.append("text")
		.attr("class", "label")
		.attr("x",width/2)
		.attr("y",height -5)
		.style("text-anchor","middle")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Food Imports (as % of Imported Merchandise)");
		//.text("Food Imports (as % of total merchandise imports)");

	svg.append("g")
		.attr("class", "y_axis")
		.attr("transform", "translate(70,0)")
		.call(yAxis);

	svg.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x",-120)
		.attr("y",30)
		.style("text-anchor","end")
		.style("font-weight","bold")
		.style("font-size", "26px")
		.text("Gini Inequality Score");

////redo axes ^^^^

	update.append("circle")
		.attr("r", function(d,i){
			if(d.food == 0){
				return 0
			}else{
			return Math.sqrt(rscale(d.ag)/Math.PI)
			}		
		})
		.attr("class", "landarea")
		.attr("cx",function(d,i){return xscale(d.food)})
		.attr("cy", function(d,i){return yscale(d.gini)})
		.style("display",function(d){if(d.gini == 0){return "none";}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.style("stroke", function(d){
			if(d.elec == 100){
				return "#fcc30b"
			}else{
				return "#222222"
			}})
		//	}else
//			 if(d.ag >100000){
//				return "#56c02b"
//			}else{
//				return "#222222"
//			}})
		.style("opacity",0.75)
/*
^^^^^^^^^^^^^^^ INITIAL RENDER ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv POINT SWELL ANIME vvvvvvvvvvvvvvvvvv
*/
		.on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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


/*
^^^^^^^^^^^^^^^ POINT SWELL ANIME ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv LAND AREA BUTTON FUNCTION vvvvvvvvvvvvvvvvvv
*/

		landa.on("click", function(){
			//d3.select(this).transition()
			update.selectAll("circle")
			.attr("class", "landarea")
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.gini)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.gini)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});


		//update.selectAll(".landarea").selectAll("circle").on("mouseout", function(){
		update.selectAll(".landarea").on("mouseout", function(){
			d3.select(this)
			.transition()
			.style("opacity",function(d){
				if(d.food == 0){
					return 0;
				}else{
					return 0.75;
				}})
		.style("fill", function(d){
			if(d.Continent == "Africa"){
				return "#e5243b"
			}else{
				//return "#0A294E"
				return "#19486a"
			}
		})
		.style("stroke", function(d){
			if(d.food == 0){
				return "white"
			}else if(d.ag >50000){
				return "#56c02b"
			}else{
				return "#222222"
			}})
		.style("stroke-width",function(d){
			if(d.ag >5000){return "2px"}
				else{return "0.5px"}
			})
		.attr("r", function(el){return Math.sqrt(rscale(el.ag)/Math.PI)})
		d3.selectAll("circle").selectAll("line ")
			.transition()
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.gini)})
		d3.selectAll("circle").selectAll("text")
			.transition()
				.attr("x",function(el,i){return xscale(el.food)})
				.attr("y",function(el,i){return yscale(el.gini)})
				.style("opacity",0);
			
		div.transition()
			.style("opacity",0)
		});

/*
^^^^^^^^^^^^^^^ LAND AREA BUTTON FUNCTION ^^^^^^^^^^^^^^^
vvvvvvvvvvvvvvv GDPCAP vvvvvvvvvvvvvvvvvv
*/

		gdpc.on("click", function(d){
			//d3.select(this)
			update.selectAll("circle")
				.attr("class", ".gdpcapita")
				.append("line")
				.attr("class", ".mark")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.gini)})
				.transition()
				.style("stroke", "white")
				.style("opacity", "0.5")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return Math.sqrt(yscale(poprscale(el.gdpcap)/Math.PI))*(Math.sin(radscale(0)))})

			
			//d3.select(this)
			d3.selectAll("circle")
				.append("line")
				.attr("class", "#persity")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.gini)})
				.transition()
				.style("stroke", "white")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){
					var ans = xscale(el.food)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
					return ans//-Math.PI/4
					});

				//d3.select(this).append("text")
				d3.selectAll("circle").append("text")
					.attr("x",function(el,i){return xscale(el.food)})
					.attr("y",function(el,i){return yscale(el.gini)})
					.style("fill", "white")
					.transition()
					.style("fill", "white")
					.text(function(el){return el.percity+"%"})
					.attr("x",function(el){
						var ans = xscale(el.gini)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.cos(radscale(piescale(el.percity))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.gdpcap)/Math.PI)*(Math.sin(radscale(piescale(el.percity))));
						return ans//-Math.PI+15
						})

/*
			d3.select(this)
				.append("line")
				.attr("class", "#gini")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1",function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){return xscale(el.food)})
				.attr("y2", function(el,i){return yscale(el.gini)})
				.transition()
				.style("stroke", "#FFDC00")
				.attr("x1",function(el,i){return xscale(el.food)})
				.attr("y1", function(el,i){return yscale(el.gini)})
				.attr("x2",function(el,i){
					var ans = xscale(el.gini)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.gini)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})
				.attr("y2", function(el,i){
					var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.gini)/100)*100/el.pop))));
					return ans//-Math.PI/4
					})

				d3.select(this).append("text")
					.attr("x",function(el,i){return xscale(el.gini)})
					.attr("y",function(el,i){return yscale(el.gdpcap)})
					.style("fill", "white")
					.transition()
					.style("fill", "darkgrey")
					.text(function(el){return el.gini+"%"})
					.attr("x",function(el){
						var ans = xscale(el.gini)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.cos(radscale(piescale(((((el.pop*el.percity)/100)*el.gini)/100)*100/el.pop))));
						return ans//-Math.PI+10
						})
					.attr("y",function(el){
						var ans = yscale(el.gdpcap)+ Math.sqrt(poprscale(el.pop)/Math.PI)*(Math.sin(radscale(piescale(((((el.pop*el.percity)/100)*el.gini)/100)*100/el.pop))));
						return ans//-Math.PI-15
						})
					*/
				
			//d3.select(this).select("circle")
			d3.selectAll("circle")
				.transition()
				.attr("r", function(el){return Math.sqrt(poprscale(el.gdpcap)/Math.PI)})
				.style("display",function(d){if(d.food == 0 || d.gini == 0){return "none"}})
				//.attr("startAngle", 0)
				//.attr("endAngle", Math.PI*2)
				//.style("fill", "black");
				.style("fill", function(d){
					if(d.Continent == "Africa"){
						return "#e5243b"
					}else{
						return "#19486a"}});
		})
		update.selectAll(".gdpcapita").on("mouseover", function(d){
			d3.select(this).transition()
				.style("opacity",1.0)
				.style("stroke-width", "2px")
				.attr("r", function(el){return Math.sqrt(rscale(el.gdpcap)/Math.PI)+5});
			div.transition()
				.style("color", "black")
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
		;
		
})
		}
