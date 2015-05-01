// stat-map.js a JavaScript's for visualising json-stat data
// using d3.js
// copyright David Morrisroe 2015
/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


// used to give an id to each graph we draw
var graphCounter=0;
// store what data set is currently loaded to prevent dataset being reloaded
var current_dataset = null;
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
    $('#button-frame').append(createButton('map-all-area', 'Map Data', 'get_data')); 
   
    
    
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


var names = ["Province or County", "Constituency",
		  "Province County or City", "Garda Region",
		  "Regional Authority", "County and Region",
		  "Province County or City","Place of Usual Residence",
		  "Location of Place of Work","County and City",
		  "Area of Residence of Bride","County of",
		  "County of Usual Residence","County",
		  "Towns by Size", "Region", "Regional Authority",
		  "Garda Division", "Local Authority", "Region and County"];
     
//////////////////////
var ds = getjsonStat();
ds=ds.Dataset(0);
//MAIN
//list_dataset();
create_lists(ds);
 
function load_data(dataset_name){
    // take a cso file ref eg AA045 and load the file
    console.log("current set " + dataset_name);
    if(current_dataset === dataset_name){
	// do not reload the same set
    } else{
	var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
	ds = getjsonStat(base + dataset_name);
	ds = ds.Dataset(0);
	$(".drop-data").remove();
	$("#button-frame").remove();
	create_lists(ds);
	current_dataset = dataset_name;
    }
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

function get_data(stat_code){
    // draw a map
    // by all of the different geographical areas
    // on the map
    // county; Provence; region; town land; garda region

    var geoName = null;
    var geoIndex = null;
    var stat = String(ds.role.metric);
    var ids = ds.id;
    var main = String(ds.label); // title of graph to be drawen
    //console.log(String(ds.label))
    var time = String(ds.role.time); // the time peirod of the data
    //var xlab = role; // xlabel of graph to be drawen
    var ylab = String(ds.role.metric.label); // ylabel of graph to be drawen
    var stat_index = null;
    var found_flag = false;
    var labels = [];
    
    for(var i=0; i<ids.length; ++i){
	if (ids[i] == stat){
	    stat_index = i;
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
    
    var button_click = null;
    var stat_code_index = null;
    if(stat_code === "undefined"){
	// we came because the user clicked the "Map Data" button
	button_click = true;
    } else{
	stat_code_index = ds.Dimension(stat_index).Category(stat_code).index;
    }

    var better_main = ds.Dimension(stat_index).Category(stat_code).label; 
    if(stat_code){
	main = better_main;
    }
    else{
	console.log("better_main " + better_main)
    }
    var cube = [];
    $('#drop-downs :selected').each(function(i, selected){
	cube.push(parseInt(selected.value));
	if (i !== geoIndex)
	    labels.push(selected.text);
    });
    if(stat_code_index){
	cube[stat_index] = stat_code_index;
    }
    
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
    var legend_map = {}; // use colour as key and the county name as value
    
    for(var key in data){
	data[key] = Math.log(data[key]+1);
    }
    var margin = {top: 40, right: 10, bottom: 20, left: 100},
	width = 600 - margin.left - margin.right,
	height = 660 - margin.top - margin.bottom;
    // set the colours for the map
    var map_colours = ["rgb(237,248,233)", "rgb(186,228,179)",
		       "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"];
    // use the colours as keys for the ledgend
    for(var value in map_colours){
	legend_map[map_colours[value]] = [];
    }
    var color = d3.scale.quantize()
	.range(map_colours);
    
    
    var projection = d3.geo.albers()
      .rotate([0,0])
      .center([-8.4, 53.2])
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
	var current_colour = null;
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
	    //.attr('data-legend',function(d){ return  d.properties[area_id]; });

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
	    .style("text-size", "12px")
	    .text(myStr);

    /*svg.append('g')
	.attr("class", "legend")
	.attr("transform", "translate(50, 30)")
	.style("font-size", "16px")
	.call(d3.legend);*/
    });

}

function is_index_geo(){
    // return true if the id pased in a geographical region
    // THis is my third time doing this so I'm seperating it out
    
}
function get_set_code(stat_code){
    // take a Statistic code and return the data set
    //var stat_by_set = httpGetJson("json/stat_by_set.json");
    var set_code = stat_by_set[stat_code];
    console.log("loading set " + set_code);
    var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
    return getjsonStat(base+set_code);
}

//stat_by_time("AJA01C1");
//stat_by_time("THA16C1");
function stat_by_time(stat_code){
    // create a json of time series data for each Statistic
    // grab a single Statistic out of a dataset
    // return a structure suitiable for during a line chart with
    // a line for each dimension
    //console.log("stat_code " + stat_code);
    //var dataset = get_set_code(stat_code);
    //console.log("loading set " + dataset);
    //dataset = dataset.Dataset(0);

    // get the index of the Statistic and time 
    var ids = ds.id;
    var stat_index = null;
    var stat = String(ds.role.metric);
    var time = String(ds.role.time);
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
    var stat_code_index = ds.Dimension(stat_index).Category(stat_code).index;
    var stat_label = ds.Dimension(stat_index).Category(stat_code).label;
    var stat_base = ds.Dimension(stat_index).Category(stat_code).unit.Base;
    
    var cube = [];
    for (var j=0; j<ids.length; ++j){
	cube.push(0);
    }
    cube[stat_index] = stat_code_index; 

    var stat_time = {};
    var years = [];
    // get the years
    for(var j=0; j<ds.Dimension(time_index).length; ++j){
	years.push(ds.Dimension(time_index).Category(j).label);
    }
    var data = {};
    stat_time.data = data;
    stat_time["time_base"] = time;
    stat_time["time"] = years;
    stat_time['label'] = stat_label;
    stat_time['base'] = stat_base;
    // number of lines in set
    stat_time['n'] = years.length;
    for(i=0; i<ids.length; ++i){
	// go throught all var except stat and time
	if(i === time_index || i === stat_index)
	    continue;
	// for each dimension which is not time or statistic
	for(var k=0; k<ds.Dimension(i).length; ++k){
	    var current = [];
	    cube[i] = k;
	    var current_label = ds.Dimension(i).Category(k).label;
	    // for each time period of each dimension
	    for(var j=0; j<ds.Dimension(time_index).length; ++j){
		// create an array for all vars by time
		cube[time_index] = j;
		if(max){
		    if(parseInt(ds.Data(cube).value) > max){
			max = parseInt(ds.Data(cube).value);
		    }
		} else{   
		    max = parseInt(ds.Data(cube).value);
		}
		if(min){
		    if (parseInt(ds.Data(cube).value) < min){
			min = parseInt(ds.Data(cube).value);
		    }
		} else{
		    min = parseInt(ds.Data(cube).value);
		}
		current.push(ds.Data(cube).value);
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
    console.log("Number of Lines " + json_data['n'])
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
	width = 930 - margin.left - margin.right,
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
	lines[id]['active'] = 1;
	c+=1;
    }
    // draw each line
    var counter = 0; // used to position the add/remove line "rect"s
    for(key in lines){
	//console.log(lines[key]['label'])
	svg.append("path")
	    .attr("class", "line")
	    .attr('id', "line-" + key)
	    .attr("data-legend", lines[key]['label'])
	    .attr("data-toggle", "tooltip")
	    .attr("title", lines[key]['label'])
	    .style("stroke", function(){
		return lines[key]['colour'];})
	    .attr("d", valueline(lines[key]['data']));

	
	var rect = svg.append("rect")
	    .attr("x", counter*35)
	    .attr("y", 0-margin.top)
	    .attr("fill", lines[key]['colour'])
	    .attr("class", "data-rect")
	    .attr("data-toggle", "tooltip")
	    .attr("title", lines[key]['label'])
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
	.attr("transform","translate(730, 10)")
        .style("font-size", "12px")
	.call(d3.legend);

    // tool tip
    var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
    
    var active = true;
    $('.data-rect').mousedown(function(){
	active = lines[$(this).attr('id')]['active'] ? false : true;
	var new_opacity = active ? 0 : 1;
	d3.select('#line-' + $(this).attr('id'))
	    .transition().duration(100)
	    .style('opacity', new_opacity);
	active ? $(this).attr("fill", "#eee") : $(this).attr("fill", lines[$(this).attr("id")]["colour"]);
	lines[$(this).attr('id')]['active'] = active;
	
    });
    $(".data-rect").tooltip();
    //$('[.data-toggle="tooltip"]').tooltip();
}
