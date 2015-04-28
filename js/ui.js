// create the ui for maps4stats.com
// render all the side bars
// append the nav bar to the page

var nav_code = '<nav class="navbar navbar-fixed-top navbar-inverse">' +
      '<div class="container-fluid">'+
	'<div class="navbar-header">'+
	 ' <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">'+
          '  <span class="sr-only">Toggle navigation</span>'+
           ' <span class="icon-bar"></span>'+
            '<span class="icon-bar"></span>'+
            '<span class="icon-bar"></span>'+
	 ' </button>'+
	  '<a class="navbar-brand" href="http://www.maps4stats.com">Maps4Stats</a>'+
	'</div>'+

	'<!-- Collect the nav links, forms, and other content for toggling -->'+
	'<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'+
	 ' <ul class="nav navbar-nav">'+
          '  <li class="active"><a href="geo.html">Maps<span class="sr-only">(current)</span></a></li>'+
    ' <li><a href="base.html">Time</a></li>' +
    
	    '<li class="dropdown">'+
	     ' <a href="todo.html" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Comming Soon<span class="caret"></span></a>'+
	      '<ul class="dropdown-menu disabled" role="menu">'+
		'<li><a href="todo.html#census">Census Explorer</a></li>'+
		'<li><a href="todo.html">Farmers Friend</a></li>'+
		'<li class="divider"></li>'+
		'<li><a href="todo.html">Search</a></li>'+
		'<li class="divider"></li>'+
	      '</ul>'+
	    '</li>'+
            
	  '</ul>'+
	  
	  '<ul class="nav navbar-nav navbar-left">'+
          
	   ' <li class="dropdown">'+
	     ' <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">About <span class="caret"></span></a>'+
	      '<ul class="dropdown-menu" role="menu">'+
		'<li><a href="about.html">Goals of Project</a></li>'+
		'<li><a href="about.html">About Data</a></li>'+
		'<li><a href="about.html">Help Us</a></li>'+
		'<li class="divider"></li>'+
		'<li><a href="http://www.cso.ie">Centrel Statistics Office</a></li>'+
		'<li class="divider"></li>'+
		'<li><a href="about.html">Tools Used</a></li>'+
	      '</ul>'+
	    '</li>'+
         '</ul>'+
	 	// ' <form class="navbar-form navbar-right disabled" role="search">'+
            //'<div class="form-group">'+
             //' <input type="text" class="form-control disabled" placeholder="Search">'+
            //'</div>'+
            //'<button type="submit" class="btn btn-default disabled">Submit</button>'+
	  //'</form>'+
	'</div>'+
      '</div>'+
    '</nav>';

function make_nav_bar(){
    console.log("Making nav bar...");
    $(".my-bs-nav").append(nav_code);
}
//make_nav_bar();
