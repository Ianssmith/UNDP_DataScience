
var w = 1200;
var h = 500;
var pad = 1;

d3.queue()
.defer(d3.csv,"data/WDI/sortelec.csv")
.defer(d3.csv,"data/ssaCountries.csv")
.await(analyze);

function analyze(error,data, ssa){
	if(error)console.log(error)

//d3.csv("data/WDI/agland13sort.csv", function(data){
//d3.csv("data/WDI/agland60sort.csv", function(data){
	console.log(data)
	data.forEach(function(d){ d['_2012'] = +d['_2012'];});
	var items = data.length;
	var max = d3.max(data, function(d){return d._2012});
	var min = d3.min(data, function(d){return d._2012});
	var yscale = d3.scaleLinear()
		.domain([0,max])
		.range([0,h]);

	var xscale = d3.scaleBand()
		.domain(d3.range(0,items))
		.range([0,w])

	var tempcolor;

	var colors = d3.scaleLinear()
		.domain([0,max])
		.range(['#0074D9',"#FFDC00"])
	
	console.log(max);
	console.log(min);

var tooltip = d3.select('body').append('div')
	.attr("id","label")
	.style('postion' , 'absolute')
	.style('padding', '0 10px')
	.style('background', 'white')
	.style('opacity',0);

	var svg = d3.select("#chart").attr("align", "center")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.style("background", "#DDDDDD");

var ssastring = "";
for(var i=0;i<ssa.length;i++){
	ssastring += "," + ssa[i].SSA.toString()
}
console.log(ssastring)

	var chart = svg.selectAll("rect")
		.data(data.map(function(d){return{
			_2012: Math.floor(+d._2012),
//.sort(function s(a,b)),
			Country_Name: d.Country_Name
		}}))
		.enter().append("rect")
			.style('fill', function(d){
					if(ssastring.includes(d.Country_Name)){
						return "#FFFFFF";		
						}else{return colors(d._2012)}
					})
			.style('stroke', '#DDDDDD')
			.attr("x", function(d,i){return xscale(i)})//i*(w/data.length);})
			.attr("y", h)//function(d){return h-yscale(d._2012)})
			.attr('width', xscale.bandwidth())//w/items - pad) 
			.attr('height', 0)//function(d,i){return yscale(d._2012)})
		.on('mouseover', function(d){
			tooltip.transition()
				.style('opacity',0.9)
				
				tooltip.html(d.Country_Name+":"+d._2012+"%")
				.style("left", (d3.event.pageX)+"px")
				.style("top", (d3.event.pageY)+"px")

			tempcolor = this.style.stroke;
			d3.select(this)
				.style('opacity',0.5)
				.style('stroke','#FFFFFF')
		})
		.on('mouseout',function(d){
			d3.select(this)
				.style('opacity',1)
				.style('stroke',tempcolor)
		})

	chart.transition()
			.attr("y", function(d){return h-yscale(d._2012)})
			.attr('height', function(d,i){return yscale(d._2012)})
		.delay(function(d,i){return i*2;})
		.duration(1000)
		//.easeElasticIn(1000)
}
