
var w = 1200;
var h = 500;
var pad = 1;

//d3.csv("data/WDI/sortelec.csv", function(data){
d3.csv("data/WDI/agland13sort.csv", function(data){
//d3.csv("data/WDI/agland60sort.csv", function(data){
	console.log(data)
	data.forEach(function(d){ d['_2013'] = +d['_2013'];});
	var items = data.length;
	var max = d3.max(data, function(d){return d._2013});
	var min = d3.min(data, function(d){return d._2013});
	var yscale = d3.scaleLinear()
		.domain([0,max])
		.range([0,h]);

	var xscale = d3.scaleBand()
		.domain(d3.range(0,items))
		.range([0,w])

	var tempcolor;

	var colors = d3.scaleLinear()
		.domain([0,max])
		.range(['#85144b',"#2ECC40"])
	
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


	var chart = svg.selectAll("rect")
		.data(data.map(function(d){return{
			_2013: Math.floor(+d._2013),
//.sort(function s(a,b)),
			Country_Name: d.Country_Name
		}}))
		.enter().append("rect")
			.style('fill', function(d){return colors(d._2013)})
			.style('stroke', '#DDDDDD')
			.attr("x", function(d,i){return xscale(i)})//i*(w/data.length);})
			.attr("y", h)//function(d){return h-yscale(d._2013)})
			.attr('width', xscale.bandwidth())//w/items - pad) 
			.attr('height', 0)//function(d,i){return yscale(d._2013)})
		.on('mouseover', function(d){
			tooltip.transition()
				.style('opacity',0.9)
				
				tooltip.html(d.Country_Name+":"+d._2013+"%")
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
			.attr("y", function(d){return h-yscale(d._2013)})
			.attr('height', function(d,i){return yscale(d._2013)})
		.delay(function(d,i){return i*2;})
		.duration(1000)
		//.easeElasticIn(1000)
})
