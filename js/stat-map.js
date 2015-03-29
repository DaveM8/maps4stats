// stat-map.js a javascript for visualising json-stat data
// using d3.js

// used to give an id to each graph we draw
var graphCounter=0;
// create_lists a function which takes a jsonStat object and populates
// elements with all the lables in the data set
function create_lists(dss){
    // find the correct place on the page add a form with
    // bose for each lable in the data set
   $('#drop-downs').append(HTMLcreateDropDown.replace('%%data%%',"1"));
    // for each vairible
    for (var j=0; j<dss.Dimension().length; j++){
	// use the discription of each vairiable as the id of the element
	var select_id = dss.Dimension(j).label;
	// remove spaces and commas
	select_id = select_id.replace(/ /g, "_");
	select_id = select_id.replace(/,/g, "");
	// add a select box for each vairiable
	$('.drop-data').append(HTMLaddSelect.replace("%%data%%", select_id));
	for(var i=0; i<dss.Dimension(j).length; i++){
	    // populate the drop-downs with all data points
	    // display the lable and send the id
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
   // $('#button-frame').append(createButton('by-ed', 'ED', 'by_ed'));
    $('#button-frame').append(createButton('map-all-area', 'Map Data', 'get_data'));
    $('#button-frame').append(createButton('county-bar', 'County by Bar', 'countyBar'));
     $('#button-frame').append(createButton('stat-bar', 'Bar', 'statBar'));
    
    
}

function list_dataset(){
    var dataset_list = httpGetJson("datasets.json");
    $('#header').prepend(HTMLaddSelect.replace('%%data%%', "dataset"));
    for( i in dataset_list){
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
    // in the webready app I'll have just a selection of
    // data sets which I know will work
    // this is a possible compeate list of Irish geographical
    // refercines in the cso data
    
    var names = [ "Province or County", "Constituency",
		  "Province County or City", "Garda Region",
		  "Regional Authority", "County and Region",
		  "Province County or City","Place of Usual Residence",
		  "Location of Place of Work","County and City",
		  "Area of Residence of Bride","County of",
		  "County of Usual Residence","County",
		  "Towns by Size", "Region" ];
    
    var geoName = null;
    var geoIndex = null;
    var stat = String(ds.role.metric);
    var ids = ds.id;
    var main = String(ds.label); // title of graph to be drawen
    var role = String(ds.role.time); // the time peirod of the data
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
		console.log(geoName);
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
	//console.log(i, selected);
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
	    // hack for dealing with tipperary north + south
	    // add them tograther maybe get the mean???
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
        // adjust the base of the data set to help with compariaions
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
	//console.log(ds.Dimension(stat).Category(i));
	cube[stat_index] = i;
	//console.log(ds.Dimension(stat).Category(i).unit);
	var unit = ds.Dimension(stat).Category(i).unit
	//console.log(ds.Dimension(stat).Category(i).id)
	console.log(unit["Base"])
	stats.push(parseFloat(ds.Data(cube).value));
	labels.push(ds.Dimension(stat).Category(i).label);
    }
    
    var set = {};
    set["y"] = stats;
    set['x'] = labels;
    set['main'] = main;
    //set['unit'] = base;
    //set["main"] =
    for(i in set)
	console.log(i + " : " + set[i])
    return set;
}

function byTime(){
    // select the data foe each time peiroid for all selected options

    var ids = ds.id;
    //console.log(ids)
    var yearIndex = null;
    var statIndex = null;
    
    var main = String(ds.label); // title of graph to be drawen
       
    var role = String(ds.role.time); // the time peirod of the data
    var stat = String(ds.role.metric);
    var xlab = role; // xlabel of 
    // get ithe index of the time peirod
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
    // put the index of each metrix the user has selected
    // this array of indexs can then be past to json-stat
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
    // if a data point dose not exsit it is stored as .. in the jsonstat files
    // javascript will interpet as Nan remove any NaN values before plotting
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
    //set["colour"] = 
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
    // use an ordainal scale on the x axis for each bar
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
                 .attr("fill", function(d) {
		     var col = 0;
		     if(d > 255){
			 col = Math.round(yScale(d));
		         col =  255 - col;
			 }
		     else
			 col = d;
		     return "rgb(0, 0, " + col + ")";
		 });
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
	.attr("y", function(d) { return h- margin.top - margin.bottom;})
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
list_dataset();
create_lists(ds);

$("#info-map").on('change', function(){
    new_data_set("#info-map");
    countyBar();
});
		  
$("#dataset").on('change', function(){
    //console.log("on.change");
    new_data_set("#dataset");
});
//////////////////////////
function new_data_set(change_id){
    console.log(change_id);
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
    // take a cso file ref AA045 and load the file
    var base = "http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/";
    ds = getjsonStat(base + dataset_name);
    ds = ds.Dataset(0);
    $(".drop-data").remove();
    $("#button-frame").remove();
    create_lists(ds);
}

function getNames(examples){
    // load datasets.json and look up the names
    datasets = httpGetJson("datasets.json");
    with_names = {};
    for(var i=0; i<examples.length; ++i){
	with_names[examples[i]] = datasets[examples[i]];
    }
    return with_names;
}
						   
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
	return JSONstat(cso_base + "CD725");
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
	return "%YM%M";
    }
    else{
	return "%Y"
    }
}
function simple_line(data){
    //alert(data.role)
    graphCounter += 1;
    // grab the #drawing section and add a new div for this graph
    $("#drawing").prepend(HTMLgraphDiv.replace('%%data%%', graphCounter));
    var currentDiv = "#graph-id" + String(graphCounter);
    $(currentDiv).append(HTMLgraphTitle.replace("%%main%%", data.main));

    var margin = {top: 30, right: 20, bottom: 100, left: 100},
	width = 1000 - margin.left - margin.right,
	height = 330 - margin.top - margin.bottom;
    // format for monthly cso statistics
    var format = what_format(data.role);
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
	data_line = [];
	var parse_x = parseDate(String(data.x[i]));
	data_line.push(parse_x);
	data_line.push(data.y[i]);
	my_data.push(data_line);
	//console.log(data_line);
    }
    
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
function make_x_axis(xScale, ticks=40){
    return d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(ticks);
}
function make_y_axis(yScale, ticks=5){
    return d3.svg.axis()
	.scale(yScale)
	.orient("left")
	.ticks(ticks);
}

// create the side menu
make_side();
function make_side(){
    //var link = '<a href='
    var stat_json = httpGetJson("statstic.json");
    var stat_list = stat_json["Statstic"];
    var l = stat_list.length;
    console.log(l);
    var stat_index = [];
    for (var k=0; k<12; ++k){
	stat_index.push(Math.floor(Math.random()*l));
	
	//console.log("rand " + rand_index);
    }
    var count = 0;
    var files = httpGetJson("geo_only.json");
    var set_names= httpGetJson("datasets.json");
    $("#side").append('<ul id="side-files" class="collapsibleList"></ul>');
    $("#side-files").append('<li>Statstic<ul class="collapsibleList" id="statstic"></ul></li>');
    for (k=0; k<stat_index.length; ++k){
	console.log("k "+k);
	console.log("stat_list[k] " +stat_list[k]);
	$("#statstic").append('<li class="click-bar" id="' +stat_list[k]+ '">' + set_names[stat_list[k]] + '</li>');
    }
    for(var i in files){
	console.log("i :" + i);
	count += 1;
	$("#side-files").append('<li>' + i + '<ul class="collapsibleList" id="file-'+ count + '"></ul></li>');
	for(var j=0; j<files[i].length; j++){
	    $("#file-"+ count).append('<li class="click-bait" id="' +files[i][j]+ '">' + set_names[files[i][j]] + '</li>');
	}
    }
    CollapsibleLists.apply();
    
}

$('.click-bait').click( function() {
    //console.log($(this));
    //console.log($(this).attr('id'));
    load_data($(this).attr('id'));
    get_data();
    return false;
});

$('.click-bar').click( function() {
    load_data($(this).attr('id'));
    statBar();
    return false;
});


// draw maps of the cso data

// flow starts here




function get_data(){
    // takes a json-stat object and draws maps
    // by all of the different geographical areas
    // on the map
    // county; provence; region; townland; garda region

    // used to find the geo field in the dataset
     var names = ["Province or County", "Constituency",
		  "Province County or City", "Garda Region",
		  "Regional Authority", "County and Region",
		  "Province County or City","Place of Usual Residence",
		  "Location of Place of Work","County and City",
		  "Area of Residence of Bride","County of",
		  "County of Usual Residence","County",
		  "Towns by Size", "Region", "Regional Authority",
		  "Garda Division"];
    
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
		console.log(geoName);
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
	//console.log(i, selected);
	cube.push(parseInt(selected.value));
	if (i !== geoIndex)
	    labels.push(selected.text);
    });

    var geo_value = {};
    for(i=0; i<ds.Dimension(geoName).length; ++i){
	cube[geoIndex] = i;
	var current = ds.Dimension(geoName).Category(i).label;
	
	try{
	    console.log(current + " " + ds.Data(cube).value);
	    geo_value[current] = parseFloat(ds.Data(cube).value); 
	}catch(err){
	    console.log("Error " + current + " " + cube);
	}
	
    }
    // call the correct mapping function
    switch(geoName){
    case "Constituency":{
	// leave out for now because of problems
	// draw a map on Constituency boundrays
	console.log("Constituency");
	draw_all_map(geo_value, "maps/cons.json", "NAME", labels);
	break;
    }
    case "Towns by Size":{
	//draw_towns();
	break;
    }
    case "Garda Region":{
	console.log(geoName);
	draw_all_map(geo_value, main, "maps/garda_regions.json", "REGION", labels);
	break;
    }
    case "Garda Division":{
	clean_names = {};
	var garda_division_names =  httpGetJson("garda_divisions_names.json");
	for(var key in geo_value){
	    clean_names[garda_division_names[key]] = geo_value[key];
	}
	draw_all_map(clean_names, main, "maps/garda_districts.json",  "DIVISION", labels);
	break;
    }
    
    case "Regional Authority":
    case "Region":{
	var clean_names = clean_region_names(geo_value);
	draw_all_map(clean_names, main, "maps/nuts_pretty.json", "NUTS3NAME", labels);
	break;
    }
    case "County":
    case "County of":
    case "County of Usual Residence":
    case "County and City":
    case "Location of Place of Work":
	{
	    clean_names = clean_county_name(geo_value);

	    draw_all_map(clean_names, main, "maps/ireland_topo_pretty.json", "id", labels);
	    break;
	}
	
    case "County and Region":
	{
	    clean_names = clean_region_names(geo_value);
	    draw_all_map(clean_names, main, "maps/nuts_pretty.json", "NUTS3NAME", labels);
	    clean_names = clean_county_name(geo_value);
	    draw_all_map(clean_names, main, "maps/ireland_topo_pretty.json", "id", labels);
	    break;

	}
    case "Province County or City":
    case "Place of Usual Residence":
    case "Province or County":{
	draw_all_map(geo_value, main, "maps/province.json", "PROVNAME", labels);
	clean_names = clean_county_name(geo_value);
	draw_all_map(clean_names, main, "maps/ireland_topo_pretty.json", "id", labels);
	break;
    }
    }
}

function clean_region_names(geo_value){
    
    var clean_names = {};
    // adjust the names to match the osi files
    for(var key in geo_value){
	if (key == "Border, Midland and Western"){
	    //not working dont draw use nuts2 map               
	    //draw_all_map(geo_value, main, "maps/nuts2_new.json","NUTS2NAME");
	}
	switch(key){
	case "Dublin plus Mid East":{
	    clean_names["Dublin"] = geo_value[key];
	    clean_names["Mid-East"] = geo_value[key];
	}
	case "Midlands & East":{
	    clean_names["Dublin"] = geo_value[key];
	    clean_names['Mid-East'] = geo_value[key];
	    clean_names['Midland'] = geo_value[key];
	}
	case "West":{
	    clean_names["Mid-West"] = geo_value[key];
	    clean_names["West"] = geo_value[key];
	}
	case "North West":{
	    clean_names["Border"] = geo_value[key];
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
	    // what the fuck to do with tipperary
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

    //for(var key in data){
	//data[key] = Math.log(data[key]+1);
    //}
    var margin = {top: 20, right: 10, bottom: 20, left: 20},
	width = 600 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom;

    var color = d3.scale.log()
	.range(["rgb(237,248,233)", "rgb(186,228,179)",
		"rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);
    
    
    var projection = d3.geo.albers()
      .rotate([0,0])
      .center([-9.3, 53.2])
      .scale(9000)
      .translate([width/2, height/2])
      .precision(.1);
  
    var path = d3.geo.path()
      .projection(projection);

    var nextDiv = getNextDiv();
    var mapid = "map-" + nextDiv.substring(1);
    
    // put a map div to select maps for css
    //console.log(mapid + " " + nextDiv);
    $(nextDiv).append('<div id=' + mapid + ' class="map"></div>');
    $(nextDiv).prepend(HTMLmapTitle.replace("%%main%%", main));

    var svg = d3.select('#' + mapid).append("svg")
      	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);
    var g = svg.append("g");
    var min_max = [];
    console.log("Drawing Map");
    d3.json(map_file, function(error, geo_data){
	var area = topojson.feature(geo_data, geo_data.objects.geo_area);
	// put the values for each region into the topojson
	var geoms = geo_data.objects.geo_area.geometries;
	for(var k in geoms){
	   min_max.push(parseFloat(data[geoms[k].properties[area_id]]));
	    geoms[k].properties.value = data[geoms[k].properties[area_id]];
	    console.log(geoms[k].properties[area_id] + " " + data[geoms[k].properties[area_id]]);
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
		//console.log(d.properties['value']);
		var value = d.properties['value'];
		//console.log("value " + value);
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
	    .attr("font-size", "16px")
	    .style("text-decoration", "underline")
	    .text(myStr);

    });
}

function ed_data(){
    // get the data for an ed map
    var index_name = "Towns by Electoral Division";
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
	if(ids[i] === index_name){
	    geoName = ids[i];
	    geoIndex = i;
	    console.log(geoName);
	    found_flag = true;
	}
	
    }
    if (!found_flag){
	alert("No Geographical Data in set");
	return false;
    }
    console.log(geoName);
    console.log(stat);
    
    var cube = [];
    $('#drop-downs :selected').each(function(i, selected){
	//console.log(i, selected);
	cube.push(parseInt(selected.value));
	if (i !== geoIndex)
	    labels.push(selected.text);
    });
    var indexs = []
    var geo_value = {};
    for(i=0; i<ds.Dimension(geoName).length; ++i){
	cube[geoIndex] = i;
	indexs.push(ds.Dimension(geoName).Category(i).index);
	var current = ds.Dimension(geoName).Category(i).label;
	
	try{
	    //console.log(current + " " + ds.Data(cube).value);
	    //geo_value[current] = parseFloat(ds.Data(cube).value); 
	}catch(err){
	    //console.log("Error " + current + " " + cube);
	}
	
    }

}
function by_ed(){
    load_data("B0105");
    data = ed_data();
    //draw_all_map();
}
