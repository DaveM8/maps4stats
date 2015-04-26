// stat-map.js a JavaScript's for visualising json-stat data
// using d3.js
// copyright David Morrisroe 2015

// used to give an id to each graph we draw
var graphCounter=0;
// create_lists a function which takes a jsonStat object and populates
// elements with all the labels in the data set
function create_lists(dss){
    // find the correct place on the page add a form with
    // bose for each label in the data set
   $('#drop-downs').append(HTMLcreateDropDown.replace('%%data%%',"1"));
    // for each variable
    for (var j=0; j<dss.Dimension().length; j++){
	// use the description of each variable as the id of the element
	var select_id = dss.Dimension(j).label;
	// remove spaces and commas
	select_id = select_id.replace(/ /g, "_");
	select_id = select_id.replace(/,/g, "");
	// add a select box for each variable
	$('.drop-data').append(HTMLaddSelect.replace("%%data%%", select_id));
	for(var i=0; i<dss.Dimension(j).length; i++){
	    // populate the drop-downs with all data points
	    // display the label and send the id
	    var text = dss.Dimension(j).Category(i).label;
	    var value = dss.Dimension(j).id[i];
	    var strip_spaces = dss.Dimension(j).label;
	    strip_spaces = strip_spaces.replace(/ /g, '_');
	    strip_spaces = strip_spaces.replace(/,/g, "");
	    var select_now = '#' + strip_spaces;
	    
	    var option_box = HTMLaddOption.replace('%%value%%', i);
	    option_box = option_box.replace('%%id%%', select_id);
	    $(select_now).append(option_box.replace('%%text%%', text));
	}
	
    }
    $("#buttons").prepend("<div id=button-frame></div>");
    // add a submit button to display the data  
    $('#button-frame').append(createButton('my-submit',
					   'View Data Point','onePoint' ));

    // button to draw graphs by year
    $('#button-frame').append(createButton('by-year','Bar Chart', 'barTime'));
    $('#button-frame').append(createButton('scatter-by-year', "Line Plot", "scatterTime"));
    $('#button-frame').append(createButton('map-all-area', 'Map Data', 'get_data'));
    $('#button-frame').append(createButton('county-bar', 'County by Bar', 'countyBar'));
    $('#button-frame').append(createButton('stat-bar', 'Bar', 'statBar'));
   
    
    
}

function list_dataset(){
    var dataset_list = httpGetJson("json/datasets.json");
    $('#header').prepend(HTMLaddSelect.replace('%%data%%', "dataset"));
    for( var i in dataset_list){
	var option_box = HTMLaddOption.replace('%%value%%', i);
	option_box = option_box.replace('%%id%%', i);
	$("#dataset").append(option_box.replace('%%text%%', String(dataset_list[i])));
    }
}
   
function createButton(id, text, action){
    var myButton = HTMLbutton.replace('%%data%%', id);
    myButton = myButton.replace('%%display%%', text);
    myButton = myButton.replace('%%action%%', action);
    return myButton;
}

function onePoint(){
    // return the value at the selected point 
    var cube = [];
    $('#drop-downs :selected').each(function( i, selected){
	cube.push(parseInt($(selected).val()));
    });
    var value = ds.Data(cube).value;
    //ds.Data(cube).value
    alert(value);
}
var countys = ["Carlow","Dublin","Kildare",
			 "Kilkenny","Laois","Longford",
			 "Louth","Meath","Offaly",
			 "Westmeath","Wexford","Wicklow",
			 "Clare","Cork","Kerry","Limerick",
			 "North Tipperary",
			 "South Tipperary","Waterford",
			 "Galway","Leitrim","Mayo",
			 "Roscommon","Sligo","Cavan",
			 "Donegal","Monaghan"];


function byCounty(){
    // return the data for the current statistic for each county
    // It will be hard to make this very robust because the cso api
    // dose not include geo information
    // in the web ready app I'll have just a selection of
    // data sets which I know will work
    // this is a possible complete list of Irish geographical
    // reference in the cso data
    
    var names = [ "Province or County", "Constituency",
		  "Province County or City", "Garda Region",
		  "Regional Authority", "County and Region",
		  "Province County or City","Place of Usual Residence",
		  "Location of Place of Work","County and City",
		  "Area of Residence of Bride","County of",
		  "County of Usual Residence","County",
		  "Towns by Size", "Region", "Local Authority" ];
    
    var geoName = null;
    var geoIndex = null;
    var stat = String(ds.role.metric);
    var ids = ds.id;
    var main = String(ds.label); // title of graph to be drawn
    var role = String(ds.role.time); // the time Poirot of the data
    var xlab = role; // xlabel of graph to be drawen
    var ylab = String(ds.role.metric.label); // ylabel of graph to be drawen
    var statIndex = null;
    var found_flag = false;
    
    for(var i=0; i<ids.length; ++i){
	if (ids[i] == stat){
	    statIndex = i;
	}
	for(var j=0; j<names.length; ++j){
	    if( String(ids[i]) === String(names[j])){
		geoName = ids[i];
		geoIndex = i;
		found_flag = true;
		break;
	    }
	}
	
    }
    if (!found_flag){
	alert("No Geographical Data in set");
	return false;
    }
    var cube = [];
    $('#drop-downs :selected').each(function(i, selected){
	cube.push(parseInt(selected.value));
    });
    // TODO needs improving
    var first_Tipp = null;
    var countyData = [];
    var countyLabel = [];
    for(i=0; i<ds.Dimension(geoName).length; ++i){
	cube[geoIndex] = i;
	// only get the data for the 26 countys
	var check_county = String(ds.Dimension(geoName).Category(i).label);
	//
	// not very efficint
	for (j=countys.length; j >= 0; --j){
	    // hack for dealing with Tipperary north + south
	    // add them together maybe get the mean???
	    if(check_county.match(".*Tipperary$")){
		if  (! first_Tipp){
		    first_Tipp += parseFloat(ds.Data(cube).value);
		    countyData.push(first_Tipp);
		    countyLabel.push("Tipperary");
		    continue;
		} else{
		    first_Tipp = parseFloat(ds.Data(cube).value);
		    continue;
		}
	    }
	    if (check_county == countys[j]){
		countyData.push(parseFloat(ds.Data(cube).value));
		countyLabel.push(String(ds.Dimension(geoName).Category(i).label));
		continue;
	    }
	}
    }
        // adjust the base of the data set to help with comparisons
    var base = ds.Dimension(stat).Category(cube[statIndex]).unit['Base'];

    var set = {};
    set["y"] = countyData;
    set["x"] = countyLabel;
    set["base"] = base;
    set["main"] = main;
    set["xlab"] = xlab;
    set["xlab"] = ylab;
    set["role"] = role;
    set["region"] = geoName;

    return set;		
}

function byStat(){
    // return a data structure with all of the
    // current statistics
    // draw a nice bar chart for each statistic

    var ids = ds.id;
    var stat_index = null;
    var main = String(ds.label);

    //var time_var = String(ds.role.time);
    var stat =  String(ds.role.metric);
    
    for(var i in ids){
	if (ids[i] === stat){
	    stat_index = i;
	}
    }

    var cube =[];
    $('#drop-downs :selected').each(function(i, selected){
	cube.push(parseInt(selected.value));
    });
    var stats = [];
    var labels = [];
    var base = [];
    var stat_base = {};
    for(i =0; i<ds.Dimension(stat).length; i++){
	cube[stat_index] = i;
	var unit = ds.Dimension(stat).Category(i).unit;
	stats.push(parseFloat(ds.Data(cube).value));
	labels.push(ds.Dimension(stat).Category(i).label);
    }
  
    
    var set = {};
    set["y"] = stats;
    set['x'] = labels;
    set['main'] = main;
    //set['unit'] = base;
    //set["main"] = 
    return set;
}

function byTime(){
    // select the data foe each time period for all selected options

    var ids = ds.id;
    var yearIndex = null;
    var statIndex = null;
    
    var main = String(ds.label); // title of graph to be drawen
       
    var role = String(ds.role.time); // the time period of the data
    var stat = String(ds.role.metric);
    var xlab = role; // xlabel of 
    // get the index of the time period
    // and the current Satittic
    // these are part of the role function 
    for(var k in ids){
	if (ids[k] === role){
	    yearIndex = k;
	}
	if (ids[k] == stat){
	    statIndex = k;
	}
    }
    // put the index of each metric the user has selected
    // this array of indexes can then be past to json-stat
    // tool kit to return the value
    var cube = [];
    $('#drop-downs :selected').each(function(i, selected){
	
	cube.push(parseInt(selected.value));
    });
   
    var years = [];
    var yearLabel = [];
    var yearData = [];
    
    var ylab = String(ds.Dimension(stat).Category(cube[statIndex]).label);
    
    for(j=0;  j<ds.Dimension(role).length; j++){
	cube[yearIndex] = j;
	yearData.push(parseInt(ds.Data(cube).value));
	yearLabel.push(ds.Dimension(role).Category(j).label);
    }
    
    // remove all values which are NaN
    // if a data point dose not exist it is stored as .. in the jsonstat files
    // JavaScript will interpret as Nan remove any NaN values before plotting
    var nans = [];
    // save the index of all NaN values
    for(var j in yearData)
	if(isNaN(yearData[j]))
	    nans.push(j);
    // remove all the nan values from the data set
    for(j = nans.length-1; j>=0; j--){
	yearData.splice(j, 1); // remove each NaN value starting at the end
	yearLabel.splice(j, 1);
    }
    var base = ds.Dimension(stat).Category(cube[statIndex]).unit['Base'];
    var set = {};
    set["y"] = yearData;
    set["x"] = yearLabel;
    set["unit"] = base;
    set["main"] = main;
    set["ylab"] = ylab;
    set["xlab"] = xlab;
    set["role"] = role;
    return set;
}

function barChart(data){

    var margin = {top: 20, right: 10, bottom: 30, left: 20},
	w = 770 - margin.left - margin.right,
	h = 400 - margin.top - margin.bottom;
    
    graphCounter += 1;
    // grab the #drawing section and add a new div for this graph
    $("#drawing").prepend(HTMLgraphDiv.replace('%%data%%', graphCounter));
    currentDiv = "#graph-id" + String(graphCounter);
    $(currentDiv).append(HTMLgraphTitle.replace("%%main%%", data.main));
    // use an ordinal scale on the x axis for each bar
    var xScale = d3.scale.ordinal()
                   .domain(d3.range(data.x.length))
                   .rangeRoundBands([60, w-margin.left - margin.right], 0.05);
    
    // use a linear scale for the heights of the bars
    var yScale = d3.scale.linear()
			 .domain([0, d3.max(data.y)])
                         .range([0, h-margin.top-margin.bottom]);

    var yAxisScale = d3.scale.linear()
                       .domain([0, d3.max(data.y)])
                       .range([h, 0]);

    var svg = d3.select(currentDiv)
        .append("svg")
        .attr("width", w - margin.left - margin.right)
        .attr("height", h - margin.top - margin.bottom);

    svg.selectAll("rect")
        .data(data.y)
        .enter()
        .append("rect")
        .attr("x", function(d, i) { return xScale(i);})
        .attr("y", function(d) {
	    return h - margin.top - margin.bottom - yScale(d); })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d){ return yScale(d); })
	.attr("fill", "teal");
    /*
                 .attr("fill", function(d) {
		     var col = 0;
		     if(d > 255){
			 col = Math.round(yScale(d));
		         col =  255 - col;
			 }
		     else
			 col = d;
		     return "rgb(0, 0, " + col + ")";
		 });*/
    // label at bottom of graph
    svg.selectAll("text")
       .data(data.y)
       .enter()
       .append("text")
	.text(function(d, i) {return data.x[i]; })
       .attr("text-anchor", "middle")
       .attr("x", function(d, i) { 
	   return xScale(i) + xScale.rangeBand() / 2;
       })
	. attr("y", function(d) { return h- margin.top - margin.bottom;})
	.attr("font-family", "sans-serif")
	.attr("font-size", "12px")
	.attr("fill", "white")
	.attr("text-anchor", "middle");

    svg.append("text")
	.attr("x", (w/2))
	.attr("y", 0- (margin.top /2))
	.attr("class", "bar-chart-title")
	.attr("text-anchor", "middle")
	.attr("font-size", "16px")
	.style("text-decoration", "underline")
	.text(data.ylab);
    // x-axis label
    svg.append("text")
	.attr("transform",
	      "translate(" + (w/2) + "," +
	      (h+margin.bottom)+ ")")
	.style("text-anchor", "middle")
	.text(data.xlab);

    // y-axis lable
    svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0-margin.left)
	.attr("x", 0-(h/2))
	.attr("dy", "1em")
	.style("test-anchor", "middle")
	.text(data.ylab);
	      
    var yAxis = d3.svg.axis()
                      .scale(yAxisScale)
                       .tickFormat(d3.format("s")) 
                      .orient("left");
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + 40 + "," + 0 + ")")
       .call(yAxis);
}

//////////////////////
var ds = getjsonStat();
ds=ds.Dataset(0);
//MAIN
//list_dataset();
create_lists(ds);

$("#info-map").on('change', function(){
    new_data_set("#info-map");
    countyBar();
});
		  
$("#dataset").on('change', function(){
    new_data_set("#dataset");
});
//////////////////////////
function new_data_set(change_id){
    var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
    $(change_id + ' :selected').each(function(i, selected){
	dataset_name = $(change_id).val();
	ds = getjsonStat(base + dataset_name);
	ds = ds.Dataset(0);
	$(".drop-data").remove();
	$("#button-frame").remove();
	create_lists(ds);
    });
}
function load_data(dataset_name){
    // take a cso file ref eg AA045 and load the file
    var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
    ds = getjsonStat(base + dataset_name);
    ds = ds.Dataset(0);
    $(".drop-data").remove();
    $("#button-frame").remove();
    create_lists(ds);
}

// function dose not appear to be in use
/*
function getNames(examples){
    // load datasets.json and look up the names
    datasets = httpGetJson("json/datasets.json");
    with_names = {};
    for(var i=0; i<examples.length; ++i){
	with_names[examples[i]] = datasets[examples[i]];
    }
    return with_names;
}
*/

function barTime(){
    data = byTime();
    barChart(data);
}

function statBar(){
    data = byStat();
    barChart(data);
}

function countyBar(){
    data = byCounty();
    for(line in data)
	console.log(data[line])
    if(data){
	barChart(data);
    }
}

function scatterTime(){
    data = byTime();
    //scatter(data);
    simple_line(data);
}
function getjsonStat(url){
    // return a json stat object from cso.ie
    // if no url in defined return an example set
    if(url == undefined){
	
	var cso_base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
	return JSONstat(cso_base + "CDD01");
    }
    else {
	// load the dataset in the url we have been passed
	return JSONstat(url);
    }
}
    

// try if the url fails
function httpGetJson(theUrl){
    // get a json file from a remote server
    // return it parsed into a json object
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}
function getNextDiv(){
        graphCounter += 1;
    // grab the #drawing section and add a new div for this graph
    $("#drawing").prepend(HTMLgraphDiv.replace('%%data%%', graphCounter));
    var currentDiv = "#graph-id" + String(graphCounter);
    return currentDiv;
}

function what_format(role){

    if(role == "Month"){
	return "%YM%m";
    }else if(role === "Quarter"){
	return "%YQ%m";
    }else{
	return "%Y";
    }
}

function quater_month(quater){
    // return the month number beginning the quarter
    switch(quater){
    case 1:
	return 1;
	break;
    case 2:
	return 4;
	break;
    case 3:
	return 7;
	break;
    case 4:
	return 10;
	break;
    }
}
/************************************************************
its funny that I wrote this code to fix a problem 
but it seems to have solved its self
function parseDate(str_date, format){
    // return a Data object when given a cso date string
    // Dates come in three types
    // just the year 2000
    // yearMmonth 2014M03
    // yearQquater 2013Q03
    // Return a JavaScript date object whaic can be used
    // to draw the graph
    console.log("in parseDate");
    d3_format = d3.format(format);
    if(format === "%Y"){
	return d3_format(new Date(str_date));
    } else if(format === "%YM%m"){
	var year = str_date.substring(0,4);
	var month = str_date.substring(5);
	//console.log(month + " "+ year)
	return d3_format(new Date(year, month));
    } else if(format === "%YQ%m"){
	var year = str_date.substring(0,4);
	var quater = quater_month(str_date.substring(5));
	console.log(month + " " + quater);
	return d3_format(new Date(year, quater));
    }
}
*/
function simple_line(data){
    //alert(data.role)
    graphCounter += 1;
    // grab the #drawing section and add a new div for this graph
    $("#drawing").prepend(HTMLgraphDiv.replace('%%data%%', graphCounter));
    var currentDiv = "#graph-id" + String(graphCounter);
    $(currentDiv).append(HTMLgraphTitle.replace("%%main%%", data.main));

    var margin = {top: 30, right: 20, bottom: 50, left: 100},
	width = 800 - margin.left - margin.right,
	height = 330 - margin.top - margin.bottom;
    // format for cso statistic
    var format = what_format(data.role);
    //var date_format = d3.time.format(format);
    var parseDate = d3.time.format(format).parse;
    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    
    var valueline = d3.svg.line()
	.x(function(d) { return xScale(d[0]); })
	.y(function(d) { return yScale(d[1]); });
    
    var svg = d3.select(currentDiv)
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");
    
    var my_data = [];
    for(i=0; i<data.x.length; ++i){
	var data_line = [];
	var parse_date = parseDate(String(data.x[i]), format); 
	console.log(parse_date);
	data_line.push(parse_date);
	data_line.push(data.y[i]);
	my_data.push(data_line);
	//console.log(data_line)
    }
    for(var i in my_data){
	//console.log(my_data[i][0] + " " + my_data[i][1])
    }
    //for(var i =0; i<my_data.length; ++i){
	//console.log(my_data[i]);
    //}
    
    var xAxis = d3.svg.axis()
	.scale(xScale)
	.tickFormat(d3.time.format(format))
	.orient("bottom").ticks(10);
    
    var yAxis = d3.svg.axis()
	.scale(yScale)
	.tickFormat(d3.format("s"))
	.orient("left").ticks(data.y.lenth);
    
    // Scale the range of the data
    xScale.domain(d3.extent(my_data, function(d) { return d[0];}));
    yScale.domain([0, d3.max(my_data, function(d) { return d[1]; })]);

    svg.append("text")
	.attr("x", (width/2))
	.attr("y", 0- (margin.top /2))
	.attr("class", "line-chart-title")
	.attr("text-anchor", "middle")
	.attr("font-size", "16px")
	.style("text-decoration", "underline")
	.text(data.ylab);

    // x-axis label
    svg.append("text")
	.attr("transform",
	      "translate(" + (width/2) + "," +
	      (height+margin.bottom)+ ")")
	.style("text-anchor", "middle")
	.text(data.xlab);

    // y-axis lable
    svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0-margin.left)
	.attr("x", 0-(height))
	.attr("dy", "1em")
	.style("test-anchor", "middle")
	.text(data.ylab);

    
    svg.append("path")
	.attr("class", "line")
	.attr("d", valueline(my_data));

    svg.append("g") // Add the X Axis
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
        
    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

}

function get_data(){
    // takes a json-stat object and draws maps
    // by all of the different geographical areas
    // on the map
    // county; Provence; region; town land; garda region

    // used to find the geo field in the dataset
    // TODO deal with Local Authority edge case
     var names = ["Province or County", "Constituency",
		  "Province County or City", "Garda Region",
		  "Regional Authority", "County and Region",
		  "Province County or City","Place of Usual Residence",
		  "Location of Place of Work","County and City",
		  "Area of Residence of Bride","County of",
		  "County of Usual Residence","County",
		  "Towns by Size", "Region", "Regional Authority",
		  "Garda Division", "Local Authority", "Region and County"];
    
    var geoName = null;
    var geoIndex = null;
    var stat = String(ds.role.metric);
    var ids = ds.id;
    var main = String(ds.label); // title of graph to be drawen
    var time = String(ds.role.time); // the time peirod of the data
    //var xlab = role; // xlabel of graph to be drawen
    var ylab = String(ds.role.metric.label); // ylabel of graph to be drawen
    var statIndex = null;
    var found_flag = false;
    var labels = [];
    
    for(var i=0; i<ids.length; ++i){
	if (ids[i] == stat){
	    statIndex = i;
	}
	for(var j=0; j<names.length; ++j){
	    if( String(ids[i]) === String(names[j])){
		geoName = ids[i];
		geoIndex = i;
		found_flag = true;
		break;
	    }
	}
	
    }
    if (!found_flag){
	alert("No Geographical Data in set");
	return false;
    }
    
    var cube = [];
    $('#drop-downs :selected').each(function(i, selected){
	cube.push(parseInt(selected.value));
	if (i !== geoIndex)
	    labels.push(selected.text);
    });

    var geo_value = {};
    for(i=0; i<ds.Dimension(geoName).length; ++i){
	cube[geoIndex] = i;
	var current = ds.Dimension(geoName).Category(i).label;
	
	try{
	    geo_value[current] = parseFloat(ds.Data(cube).value); 
	}catch(err){
	    console.log("Error " + current + " " + cube);
	}
	
    }
    // call the correct mapping function
    switch(geoName){
    case "Constituency":{
	// leave out for now because of problems
	// draw a map on Constituency boundary
	// Not doing the Constituency's I could not get the maps to display
	break;
    }
    case "Towns by Size":{
	//draw_towns();
	break;
    }
    case "Garda Region":{
	draw_all_map(geo_value, main, "json/garda_regions.json", "REGION", labels);
	break;
    }
    case "Garda Division":{
	clean_names = {};
	var garda_division_names =  httpGetJson("json/garda_divisions_names.json");
	for(var key in geo_value){
	    clean_names[garda_division_names[key]] = geo_value[key];
	}
	draw_all_map(clean_names, main, "json/garda_districts.json",  "DIVISION", labels);
	break;
    }
    
    case "Regional Authority":
    case "Region":{
	var clean_names = clean_region_names(geo_value);
	draw_all_map(clean_names, main, "json/nuts_pretty.json", "NUTS3NAME", labels);
	break;
    }
    case "County":
    case "County of":
    case "County of Usual Residence":
    case "County and City":
    case "Location of Place of Work":
	{
	    clean_names = clean_county_name(geo_value);

	    draw_all_map(clean_names, main, "json/ireland_topo_pretty.json", "id", labels);
	    break;
	}
	
    case "County and Region":
	{
	    clean_names = clean_region_names(geo_value);
	    draw_all_map(clean_names, main, "json/nuts_pretty.json", "NUTS3NAME", labels);
	    clean_names = clean_county_name(geo_value);
	    draw_all_map(clean_names, main, "json/ireland_topo_pretty.json", "id", labels);
	    break;

	}
    case "Province County or City":
    case "Place of Usual Residence":
    case "Province or County":{
	draw_all_map(geo_value, main, "json/province.json", "PROVNAME", labels);
	clean_names = clean_county_name(geo_value);
	draw_all_map(clean_names, main, "json/ireland_topo_pretty.json", "id", labels);
	break;
    }
    }
}

function clean_region_names(geo_value){
    
    var clean_names = {};
    // adjust the names to match the osi files
    for(var key in geo_value){
	console.log(geo_value[key]);
	if (key == "Border, Midland and Western"){
	    //not working dont draw use nuts2 map               
	}
	switch(key){
	case "Dublin plus Mid East":{
	    clean_names["Dublin"] = geo_value[key];
	    clean_names["Mid-East"] = geo_value[key];
	    break;
	}
	case "Midlands & East":{
	    clean_names["Dublin"] = geo_value[key];
	    clean_names['Mid-East'] = geo_value[key];
	    clean_names['Midland'] = geo_value[key];
	    break;
	}
	case "West":{
	    clean_names["Mid-West"] = geo_value[key];
	    clean_names["West"] = geo_value[key];
	    break;
	}
	case "Western Region":{
	    clean_names["West"] = geo_value[key];
	    break;
	}
	case "North West":{
	    clean_names["Border"] = geo_value[key];
	    break;
	}
		
	case "South East":{
	    clean_names["South-East"] = geo_value[key];
	    break;
	}
	case "Mid East":{
	    clean_names["Mid-East"] = geo_value[key];
	    break;
	}
	case "Midlands" : {
	    clean_names["Midland"] = geo_value[key];
	    break;
	}
	case "South West" : {
	    clean_names["South-West"] = geo_value[key];
	    break;
	}
	case "Mid West" : {
	    clean_names['Mid-West'] = geo_value[key];
	    break;
	}
	default:
		clean_names[key] = geo_value[key];
	    }
    }
    return clean_names;
}

function clean_county_name(geo_value){

    var clean_names = {};
    var firstTipp = true;
    for(var key in geo_value){	
	switch(key){
	case "Tipperary North":
	case "Tipperary South":
	case "Tipperary NR":
	case "Tipperary ST":
	case "North Tipperary":
	case "South Tipperary":{
	    // what the fuck to do with Tipperary
	    // here I add them together would the mean be better?
	    if  (firstTipp){
		clean_names["Tipperary"] = parseFloat(geo_value[key]);
		firstTipp = false;
	    } else{
		clean_names["Tipperary"] = (parseFloat(geo_value[key]) + clean_names["Tipperary"]) / 2;
		
	    }
	}
	case "Cork County":
	case "Cork City and County":{
	    clean_names["Cork"] = geo_value[key];
	    break;
	}
	case "Limerick County":
	case "Limerick City and County":{
	    clean_names["Limerick"] = geo_value[key];
	    break;
	}
	case "Galway County":
	case "Galway City and County":{
	    clean_names["Galway"] = geo_value[key];
	    break;
	}
	case "Waterford County":
	case "Waterford City and County":{
	    clean_names["Waterford"] = geo_value[key];
	    break;
	}
	default:
	    clean_names[key] = geo_value[key];
	    
	}
    }
    return clean_names;
}
function draw_all_map(data, main, map_file, area_id, labels){
    // takes: data a dict with the name of the area as key
    // 	      and the value to map as value
    //     

    for(var key in data){
	data[key] = Math.log(data[key]+1);
    }
    var margin = {top: 20, right: 10, bottom: 20, left: 20},
	width = 600 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

    var color = d3.scale.quantize()
	.range(["rgb(237,248,233)", "rgb(186,228,179)",
		"rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);
    
    
    var projection = d3.geo.albers()
      .rotate([0,0])
      .center([-9.3, 53.2])
      .scale(7500)
      .translate([width/2, height/2])
      .precision(.1);
  
    var path = d3.geo.path()
      .projection(projection);

    var nextDiv = getNextDiv();
    var mapid = "map-" + nextDiv.substring(1);
    
    // put a map div to select maps for css
    $(nextDiv).append('<div id=' + mapid + ' class="map col-xs-12 col-md-8"></div>');
    $(nextDiv).prepend(HTMLmapTitle.replace("%%main%%", main));

    var svg = d3.select('#' + mapid).append("svg")
      	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);
    var g = svg.append("g");
    var min_max = [];

    d3.json(map_file, function(error, geo_data){
	var area = topojson.feature(geo_data, geo_data.objects.geo_area);
	// put the values for each region into the topojson
	var geoms = geo_data.objects.geo_area.geometries;
	for(var k in geoms){
	   min_max.push(parseFloat(data[geoms[k].properties[area_id]]));
	    geoms[k].properties.value = data[geoms[k].properties[area_id]];

	}
	color.domain([d3.min(min_max), d3.max(min_max)]);
	var text_color = null;
	svg.append("g")
            .attr("class", "feature feature--county")
            .selectAll("path")
            .data(topojson.feature(geo_data, geo_data.objects.geo_area).features)
            .enter()
            .append("path")
            .attr("d", path)
	    .style("fill", function(d){
		// Get data value
		var value = d.properties['value'];
		if(value){
		    // the value exsits
		    return color(value);
		}else{
		    // no value exists
		    return "#eee";
		}
	    });

	svg.append("path")
            .datum(topojson.mesh(geo_data, geo_data.objects.geo_area, function(a, b)
                                                          { return a !== b }))
            .attr("class", "boundary boundary--county")
            .style("stroke-width", "1px")
            .attr("d", path);
	
     
	svg.selectAll("text")
            .data(area.features)
            .enter().append("text")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text( function(d) { return d.properties[area_id]; });
	var myStr = "";
	for(var value in labels){
	    myStr += labels[value] + ", ";
	}
	svg.append("text")
	    .attr("x", (width/2))
	    .attr("y",  (margin.top /2))
	    .attr("text-anchor", "middle")
	    .attr("font-size", "24px")
	    .style("text-decoration", "underline")
	    .text(myStr);

    });
}

function get_set_code(stat_code){
    // take a Statistic code and return the data set
    var stat_by_set = httpGetJson("json/stat_by_set.json");
    var set_code = stat_by_set[stat_code];
    var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
    return getjsonStat(base+set_code);
}

function md(id){
    
}
//stat_by_time("AJA01C1");
//stat_by_time("THA16C1");
function stat_by_time(stat_code){
    // create a json of time series data for each Statistic
    // grab a single Statistic out of a dataset
    // return a structure suitiable for during a line chart with
    // a line for each dimension
    var dataset = get_set_code(stat_code);
    dataset = dataset.Dataset(0);

    // get the index of the Statistic and time 
    var ids = dataset.id;
    var stat_index = null;
    var stat = String(dataset.role.metric);
    var time = String(dataset.role.time);
    var time_index = null;
    // max min need to scale the graph
    var max = null;
    var min = null;
    //var num_var = dataset.length;
    for(var i in ids){
	if(ids[i] === stat){
	    stat_index = parseInt(i);
	}
	if (ids[i] === time){
	    time_index = parseInt(i);
	}
    }
    var stat_code_index = dataset.Dimension(stat_index).Category(stat_code).index;
    var stat_label = dataset.Dimension(stat_index).Category(stat_code).label;
    var stat_base = dataset.Dimension(stat_index).Category(stat_code).unit.Base;
    
    var cube = [];
    for (var j=0; j<ids.length; ++j){
	cube.push(0);
    }
    cube[stat_index] = stat_code_index; 

    var stat_time = {};
    var years = [];
    // get the years
    for(var j=0; j<dataset.Dimension(time_index).length; ++j){
	years.push(dataset.Dimension(time_index).Category(j).label);
    }
    var data = {};
    stat_time.data = data;
    stat_time["time_base"] = time;
    stat_time["time"] = years;
    stat_time['label'] = stat_label;
    stat_time['base'] = stat_base;
    for(i=0; i<ids.length; ++i){
	// go throught all var except stat and time
	if(i === time_index || i === stat_index)
	    continue;
	// for each dimension which is not time or statistic
	for(var k=0; k<dataset.Dimension(i).length; ++k){
	    var current = [];
	    cube[i] = k;
	    var current_label = dataset.Dimension(i).Category(k).label;
	    // for each time period of each dimension
	    for(var j=0; j<dataset.Dimension(time_index).length; ++j){
		// create an array for all vars by time
		cube[time_index] = j;
		if(max){
		    if(parseInt(dataset.Data(cube).value) > max){
			max = parseInt(dataset.Data(cube).value);
		    }
		} else{   
		    max = parseInt(dataset.Data(cube).value);
		}
		if(min){
		    if (parseInt(dataset.Data(cube).value) < min){
			min = parseInt(dataset.Data(cube).value);
		    }
		} else{
		    min = parseInt(dataset.Data(cube).value);
		}
		current.push(dataset.Data(cube).value);
	    }
	    //stat_time[current_label] = current;
	    stat_time['data'][current_label] = current;
	   // break;
	}
	
    }
    stat_time.max = max;
    stat_time.min = min;
    console.log("max " + max + " min " + min);
    for (var key in stat_time.data){
	//console.log(key + " " + stat_time.data[key]);
    }
    time_stat(stat_time);
    //return stat_time;
    
}

function time_stat(json_data){
    // take a json file with time series data and
    // draw all of the variables on a line chart
    if(json_data["time"].length < 2){
	alert("Data not time series");
	return -1;
    }
    // extended from simple_line()
    graphCounter += 1;
    // grab the #drawing section and add a new div for this graph
    $("#drawing").prepend(HTMLgraphDiv.replace('%%data%%', graphCounter));
    var currentDiv = "#graph-id" + String(graphCounter);
    //$(currentDiv).append(HTMLlegendDiv.replace('%%data%%', graphCounter));
    //var legend_div = "legend-id" + graphCounter;
    //$(currentDiv).append(HTMLgraphTitle.replace("%%main%%", json_data.label));

    var margin = {top: 50, right: 200, bottom: 30, left: 30},
	width = 880 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;
    // format for monthly cso statistics
    var format = what_format(json_data.time_base);
    var parseDate = d3.time.format(format).parse;

    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    
    var valueline = d3.svg.line()
	.x(function(d) { return xScale(d[0]); })
	.y(function(d) { return yScale(d[1]); });
    
    var svg = d3.select(currentDiv)
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");
    
     // Scale the range of the data
    var time_scale = d3.extent(json_data.time);
    // convert the max min to Date types befor using in the domain
    time_scale[0] = parseDate((String(time_scale[0])));
    time_scale[1] = parseDate((String(time_scale[1])));
    xScale.domain(time_scale);
    // if the minimum value is positive start the y axis at 0
    // if the minimum is less than 0 start the there
    // TODO draw a light line at 0 if the axis is below 0
    var min_scale = 0;
    if (json_data.min < 0)
	min_scale = json_data.min;
    yScale.domain([min_scale, json_data.max]);
   
    var xAxis = d3.svg.axis()
	.scale(xScale)
	.tickFormat(d3.time.format(format))
        //.tickFormat("")    
	.orient("bottom").ticks(10);
    
    var yAxis = d3.svg.axis()
	.scale(yScale)
	.tickFormat(d3.format("s"))
	.orient("left").ticks(5);


    svg.append("text")
	.attr("x", (width/2))
	.attr("y", 0)
	.attr("class", "line-chart-title")
	.attr("text-anchor", "middle")
	.attr("font-size", "16px")
	.style("text-decoration", "underline")
	.text(json_data.label);

    
    // x-axis label
    svg.append("text")
	.attr("transform",
	      "translate(" + (width/2) + "," +
	      (height+margin.bottom)+ ")")
	.style("text-anchor", "middle")
	.text(json_data.time_base);

    // y-axis label
    svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0-margin.left)
	.attr("x", 0-(height))
	.attr("dy", "1em")
	.style("test-anchor", "middle")
	.text(json_data.base);

    // create a data structure with the x, y cordinets of each
    // line and a colour for each line
    var colour = d3.scale.category20();
    var c = 0;
    var lines = {};
    for(var key in json_data.data){
	
	var id = "uid-" + c;
	lines[id] = {};
	lines[id]['label'] = key;
	lines[id]['data'] = null;
	lines[id]['colour'] = null;
	
	// for each data array in json_data.data
	// create a 2d array format [[time, value], [time, value]...]
	// pass this to svg.path to draw the line 
	var line_data =[];
	var each_line ={};
	for(var i=0; i<json_data.data[key].length; ++i){
	    var parse_x = parseDate(String(json_data.time[i]));
	    //console.log(parse_x)
	    line_data.push([parse_x, json_data.data[key][i]]);	    
	}
	lines[id]["data"] = line_data;
	lines[id]["colour"] = colour(c);
	lines[id]['active'] = true;
	c+=1;
    }
    // draw each line
    var counter = 1;
    for(key in lines){
	console.log(lines[key]['label'])
	svg.append("path")
	    .attr("class", "line")
	    .attr('id', "line-" + key)
	    .attr("data-legend", lines[key]['label']) 
	    .style("stroke", function(){
		return lines[key]['colour'];})
	    .attr("d", valueline(lines[key]['data']));

	
	var rect = svg.append("rect")
	    .attr("x", counter*35)
	    .attr("y", 0-margin.top)
	    .attr("fill", lines[key]['colour'])
	    .attr("class", "data-rect")
	    .attr("id", key)
	    .attr("width", 30)
	    .attr("height", 30)
	/*
	    .on("mouseover", function() {
		div.transition()
		    .duration(200)
		    .style("opacity", .9);
		div
		    .html("Click to add<br>or romove lines")
		    .style("left", (d3.event.pageX) + "px")
		    .style("top", (d3.event.pageY - 28) + "px");
	    })
	    .on("mouseout", function() {
		div.transition()
		    .duration(500)
		    .style("opacity", 0);
	    });*/
	counter += 1;
    }

   
    svg.append("g") // Add the X Axis
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
        
    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);
  
    legend = svg.append('g')
	.attr("class", "legend")
	.attr("transform","translate(700, 30)")
        .style("font-size", "12px")
	.call(d3.legend);

    // tool tip
    var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
    

    $('.data-rect').mousedown(function(){
	var active = lines[$(this).attr('id')]['active'] ? false : true;
	var new_opacity = active ? 0 : 1;
	d3.select('#line-' + $(this).attr('id'))
	    .transition().duration(100)
	    .style('opacity', new_opacity);
	active ? $(this).attr("fill", "#eee") : $(this).attr("fill", lines[$(this).attr("id")]["colour"]);
	lines[$(this).attr('id')]['active'] = active;
	
    });
}
