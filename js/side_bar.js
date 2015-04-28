// frame work to draw side-nav bars in maps4stats

// global file to prevent loading each time
// a side bar link is clicked

var stat_by_set = httpGetJson("json/stat_by_set.json");
var stat_by_label = httpGetJson("json/stat_by_label.json");

function side_by_geo(){
    // use a json file to create the side bar for viewing geographical data
    var count = 0;
    var line_colour = null;
    var geo = httpGetJson("json/geo_by_stat.json");

    var set_names= httpGetJson("json/datasets.json");
    $("#side").append('<ul id="side-files" class="collapsibleList"></ul>');
    
    for(var area in geo){
	count += 1;
	$("#side-files").append('<li>' + area + '<ul class="collapsibleList" id="file-'+ count + '"></ul></li>');
	for(var set in geo[area]){
	    //console.log(set + " " + set_names[set]) 
	    $("#file-" + count).append('<li>' + set_names[set] +
				       '<ul class="collapsibleList" id="file-' + set +
				       '"></ul></li>');
			
	    for(var stat=0; stat < geo[area][set].length; stat++){
		//console.log(geo[area][set][stat] + stat_by_label[geo[area][set][stat]]);
		if((stat % 2) === 0)
		    line_colour = "bg-success";
		else
		    line_colour = "bg-info";
		$("#file-"+ set).append('<li class="click-geo list-unstyled ' + line_colour + '" id="' +
						   geo[area][set][stat] + '">' +
						   stat_by_label[geo[area][set][stat]] + '</li>');
		                                   
	    }
	   
	}
    }
    CollapsibleLists.apply();
    
}



function side_by_base(){
    // create a side bar showing the datasets by unit
    // this will create a line chart with many lines on it 
    var set_names= httpGetJson("json/datasets.json");
    //var stat_by_set = httpGetJson("json/stat_by_set.json");
    var unit_by_set = httpGetJson("json/unit_by_stat.json");
    var line_colour = null;
    var id_counter = 0;

    $("#side").append('<ul id="side-files" class="collapsibleList"></ul>');
    for(var i in unit_by_set){
	id_counter += 1;
	$("#side-files").append('<li>' + i + '<ul class="collapsibleList" id="side-by-unit-'+ id_counter + '"></ul></li>');
	for(var j=0; j<unit_by_set[i].length; j++){
	    if((j % 2) === 0)
		line_colour = "bg-success";
	    else
		line_colour = "bg-info";
	    
	    $("#side-by-unit-"+id_counter).append('<li class="click-unit list-unstyled ' + line_colour + '" id="' +
						  unit_by_set[i][j] +
						  '">' + stat_by_label[[unit_by_set[i][j]]] + '</li>');
	}
	
    }
    CollapsibleLists.apply();
}
//* removing as part of applification
/*
function side_by_feature(){
    var set_names= httpGetJson("json/datasets.json");
    var files = httpGetJson("json/files.json");
    var count = 0;
    $("#side").append('<ul id="side-files" class="collapsibleList"></ul>');
    
    for(var i in files){
	count += 1;
	$("#side-files").append('<li>' + i + '<ul class="collapsibleList" id="file-'+ count + '"></ul></li>');
	for(var j=0; j<files[i].length; j++){
	    $("#file-"+ count).append('<li class="click-bar" id="' +files[i][j]+ '">' + set_names[files[i][j]] + '</li>');
	}
    }
    CollapsibleLists.apply();
    
}
*/

/*   
$('.click-geo').click( function() {
    load_data($(this).attr('id'));
    console.log("current_set " + $(this).attr('id'));
    get_data();
    return false;
});*/

/*
$('.click-unit').click( function(){
    //var stat_by_set = httpGetJson("json/stat_by_set.json");
    load_data(stat_by_set[$(this).attr('id')]);
    console.log("current set " + stat_by_set[$(this).attr('id')]);
    stat_by_time($(this).attr('id'));
    return false;
});
*/
