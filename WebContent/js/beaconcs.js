
function initialize(){
	/*
	 * setup two lists one for the main page user and one for the controller
	 */
	//main page list
	var mainpagelist = createmainpagelist(1);
	
	//main page list scroller
	var scrolllist = createscrolllist(6);
	
	/*
	 * setup login page
	 */
	var login = createloginpage();
	//need scrollist for size attribute
	createloginlisthtml(scrolllist,login);
	//add login to mainpagelist
	mainpagelist.insertdiv(login.htmlwindowdiv); //change to window
	//add login page to list
	scrolllist.insertdiv(login.htmllistdiv);
	
	
	/*
	 * setup beacon management page
	 */
	var beaconmgr = createbeaconmgrpage();//has publisher subscriber capability
	createbeaconmgrlisthtml(scrolllist,beaconmgr);
	//mainpagelist.insertdiv(beaconmgr.htmlwindowdiv); //change to window
	//scrolllist.insertdiv(beaconmgr.htmllistdiv);
	
	/*
	 * setup splash screen
	 */
	var splash=createsplashscreen();
	createsplashhtml(mainpagelist,splash);
	createsplashlisthtml(scrolllist,splash);
	mainpagelist.insertdiv(splash.htmldiv); //change to window
	scrolllist.insertdiv(splash.htmllistdiv);
	
	/*
	 * setup main google map
	 */
	var googlemap = creategooglemappage(); //notificationinterface implemented already
	createmaingooglemaplisthtml(scrolllist, googlemap);
	mainpagelist.insertdiv(googlemap.htmldiv); //change to window
	scrolllist.insertdiv(googlemap.htmllistdiv);
	beaconmgr.addsubscriber(googlemap);
	googlemap.beaconmanager=beaconmgr;
	/*
	 * create control system to handle events from objects and the two main screen lists
	 * the login object and the beaconmgr object
	 */
	var beaconmgrcs = createbeaconmgrcs();
	
	scrolllist.addsubscriber(beaconmgrcs);
	mainpagelist.addsubscriber(beaconmgrcs);
	login.addsubscriber(beaconmgrcs);
	beaconmgr.addsubscriber(beaconmgrcs);
	beaconmgr.beaconslist.addsubscriber(beaconmgrcs);
	beaconmgrcs.mainlist=mainpagelist;
	beaconmgrcs.scrolllist=scrolllist;
	beaconmgrcs.loginobj=login;
	beaconmgrcs.beaconmgrobj=beaconmgr;
	beaconmgrcs.splashobj=splash;
	beaconmgrcs.maingooglemapobj=googlemap;
}

function createsplashscreen(){
	var splash = createsplash();
	splash.initialize();
	objectstore[splash.id]=splash;//used for web page calls
	return splash;
};
function creategooglemappage(){
	var googlemap = creategooglemap();
	//createmaingooglemaphtml(googlemap);//now google map object has a div element name map_$id
	googlemap.initialize();
	googlemap.initializediv(googlemap.htmldiv);
	objectstore[googlemap.id]=googlemap;//used for web page calls
	
	//notification interface to handle events from the beacon manager
	googlemap.notification=function(eventmsg){
		if(eventmsg!=null){
			//alert("map recieve a beacon mgr update "+eventmsg.type+" event "+eventmsg.event+" id "+eventmsg.id);
			if(eventmsg.type=="beacon close"){
				/*
				 * 1. get becon object from object store it should be there
				 * 2. get current beacon information like name and lat lng if avail
				 * 3. add a new google circle to google map is beacon does not have one yet for main map
				 * 4. a)get beacons main map maphtmldiv and if lat lng is within bounds of map area, show the div on map loc (?)
				 * 4. b)or show information using google maps objects try google InfoWindow
				 */
				var beacon = objectstore[eventmsg.id];
				var beaconname=beacon.name;//put into infor window with others if possible
				var latlng=null;
				var radius=null;
				if(beacon.map!=null && beacon.map.circle!=null){
					latlng = beacon.map.circle.circle.center;
					radius = beacon.map.circle.circle.radius; 
				}else{
					//alert("using beacon object since primary circle not made yet! "+beacon.latitude+" "+beacon.longitude);
					latlng = new google.maps.LatLng(beacon.latitude,beacon.longitude);
					radius = beacon.range; 
				}
				
				if(beacon.mainmapcircle==null){//need to add new circle to map
					//alert("create new circle on main map at "+latlng+" radius "+radius+" for beacon "+beaconname);
					beacon.mainmapcircle = googlemap.createnewgooglecircle(radius,latlng.lat(),latlng.lng());
					var infowindow = new google.maps.InfoWindow({content:beaconname,maxWidth:15,position:latlng});
					beacon.infowindow=infowindow;
					/*
					 * add event listeners?
					 * or show info window
					 */
					google.maps.event.addListener(beacon.mainmapcircle.circle, 'click', function() {  infowindow.open(googlemap.googlemap,null);});
				}else{//do an update cirlce options on cirlce
					var circleoptions={center:latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:googlemap.googlemap,radius:radius,strokeWeight:1};
					beacon.mainmapcircle.circle.setOptions(circleoptions);
					beacon.infowindow.setOptions({content:beacon.htmllistdiv,maxWidth:15,position:latlng});
				}
				
			}
		}
	};
	return googlemap;
}

function createmainpagelist(size){
	var mainpagelist = createlist(size);
	mainpagelist.scrollable=false;
	mainpagelist.divwidth=300;
	mainpagelist.divheight=200;
	mainpagelist.bgcolor="white";
	mainpagelist.selcolor="white";
	mainpagelist.mousemoveable=false;
	mainpagelist.initialize();
	//alert("store main page list at "+mainpagelist.rootdivelement.getAttribute("id"));
	listobjectstore[mainpagelist.rootdivelement.getAttribute("id")]=mainpagelist;
	document.getElementById("mainviewer").appendChild(mainpagelist.rootdivelement);
	document.getElementById("mainviewer").style.width=mainpagelist.divwidth;
	addpublishersubscriber(mainpagelist);
	return mainpagelist;
}

function createbeaconmgrpage(){
	var beaconmgr = createbeaconmanager();
	//intialize login this will create a new key id to uniquely id the login object and its associated pages
	beaconmgr.initialize();
	
	//register login with object store
	//alert("store login at "+login.id);
	objectstore[beaconmgr.id]=beaconmgr;
	
	//add publisher subscriber and transport so other objects can subscribe to login events and for loginn to 
	//communicate with backed server : see json messaging on what login sends and expects to recieive
	addpublishersubscriber(beaconmgr);//addtransport(login);
	addtransport(beaconmgr);
	//setup html page and html window and html list pages
	createbeaconmgrhtml(beaconmgr);
	createwindow(beaconmgr);  
	return beaconmgr;
}

function createloginpage(){
	var login = createlogin();
	//intialize login this will create a new key id to uniquely id the login object and its associated pages
	login.initialize();
	
	//register login with object store
	//alert("store login at "+login.id);
	objectstore[login.id]=login;
	
	//add publisher subscriber and transport so other objects can subscribe to login events and for loginn to 
	//communicate with backed server : see json messaging on what login sends and expects to recieive
	addpublishersubscriber(login);addtransport(login);
	
	//setup html page and html window and html list pages
	createloginhtml(login);
	createwindow(login);  //adds toggle function to object
	return login;
}

function createscrolllist(size){
	var scrolllist = createlist(size);
	scrolllist.divwidth=90;
	scrolllist.divheight=30;
	scrolllist.bgcolor="#FCFCFC";
	scrolllist.selcolor="#ECECEC";
	scrolllist.initialize();
	
	listobjectstore[scrolllist.rootdivelement.getAttribute("id")]=scrolllist;
	document.getElementById("pagescroller").appendChild(scrolllist.rootdivelement);
	document.getElementById("pagescroller").style.width=scrolllist.divwidth;
	addpublishersubscriber(scrolllist);
	return scrolllist;
}

