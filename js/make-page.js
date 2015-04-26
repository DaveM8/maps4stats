// append the nav bar to the page

function make_nav(){
    var nav_code = '
    <nav class="navbar navbar-fixed-top navbar-inverse">
      <div class="container-fluid">
	<!-- Brand and toggle get grouped for better mobile display -->
	<div class="navbar-header">
	  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
	  </button>
	  <a class="navbar-brand" href="#">Maps4Stats</a>
	</div>

	<!-- Collect the nav links, forms, and other content for toggling -->
	<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	  <ul class="nav navbar-nav">
            <li class="active"><a href="#">Maps<span class="sr-only">(current)</span></a></li>
            <li><a href="#">Time</a></li>
	    <li class="dropdown">
	      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">View Data<span class="caret"></span></a>
	      <ul class="dropdown-menu" role="menu">
		<li><a href="base.html">By Base</a></li>
		<li><a href="geo.html">By Geographical Area</a></li>
		<li><a href="field.html">By Field</a></li>
		<li class="divider"></li>
		<li><a href="adv_search.html">Search</a></li>
		<li class="divider"></li>
		<li><a href="donate.html">Donations</a></li>
	      </ul>
	    </li>
            
	  </ul>
	  
	  <ul class="nav navbar-nav navbar-right">
          
	    <li class="dropdown">
	      <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">About <span class="caret"></span></a>
	      <ul class="dropdown-menu" role="menu">
		<li><a href="#">Goals of Project</a></li>
		<li><a href="#">About Data</a></li>
		<li><a href="#">Help Us</a></li>
		<li class="divider"></li>
		<li><a href="#">Centrel Statistics Office</a></li>
		<li class="divider"></li>
		<li><a href="#">Tools Used</a></li>
	      </ul>
	    </li>
          </ul>
	 	  <form class="navbar-form navbar-right" role="search">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
	  </form>
	</div>
      </div>
    </nav>
'
    console.log(nav_code);
    $(".my-bs-nav").append(nav_code);
}

make_nav();
