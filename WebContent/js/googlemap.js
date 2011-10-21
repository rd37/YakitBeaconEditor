function creategooglemap(){
	var map=new Object();
	map.id=null;
	map.circle=null;
	map.googlemap=null;
	map.latlng=null;
	map.mapOptions=null;
	map.beaconmanager=null;
	//parameters
	map.htmldiv=null;
	map.htmllistdiv=null;
	map.htmlwindowdiv=null;
	map.state=0;
	
	
	//functions
	map.initialize = function(){
		map.state=0;
		map.id=getnewkey();//get new key is in beaconobjectfactory script
		map.htmldiv=document.createElement("div");
		map.htmldiv.setAttribute("id", "htmldiv"+map.id);
		map.htmldiv.setAttribute("parentid", map.id);
		map.htmllistdiv=document.createElement("div");
		map.htmllistdiv.setAttribute("id", "htmllistdiv"+map.id);//font: '16pt'
		map.htmllistdiv.setAttribute("parentid", map.id);
		map.htmlwindowdiv=document.createElement("div");
		map.htmlwindowdiv.setAttribute("id", "htmlwindowdiv"+map.id);//font: '16pt'
		map.htmlwindowdiv.setAttribute("parentid", map.id);
	};
	map.initializediv=function(divid){
		//alert("set map id position is "+divid);
		map.latlng = new google.maps.LatLng(48.4633, -123.3133);     
		map.mapOptions = {zoom: 15, center: map.latlng, mapTypeId: google.maps.MapTypeId.ROADMAP};     
		map.googlemap = new google.maps.Map(divid, map.mapOptions);
	};
	map.createnewgooglecircle=function(rad,lat,lng){
		var circleobj = new Object();
		//alert("new gogole cirlce");
		circleobj.latlng = new google.maps.LatLng(lat,lng);
		circleobj.circleoptions={center:circleobj.latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map.googlemap,radius:rad,strokeWeight:1};
		//alert("cirlce half wasy");
		circleobj.circle = new google.maps.Circle(circleobj.circleoptions);
		//alert("done");
		circleobj.radius=rad;
		circleobj.map=map.googlemap;
		//alert("ret");
		circleobj.resize=function(latlng){
			var distance = getlatlngdistance(latlng,circleobj.circleoptions.center);
			//alert("distance is "+distance+" meters ");
			circleobj.radius=distance*5000;
			//document.getElementById("monitor4").innerHTML="rad "+circleobj.radius;
			circleobj.circleoptions={center:circleobj.latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map.googlemap,radius:circleobj.radius,strokeWeight:1};
			circleobj.circle.setOptions(circleobj.circleoptions);
		};
		circleobj.move=function(latlng){
			//circleobj.latlng=latlng;
			//document.getElementById("monitor2").innerHTML="old lat "+circleobj.latlng.lat()+" old lng "+circleobj.latlng.lng();
			//document.getElementById("monitor3").innerHTML="new lat "+latlng.lat()+" new lng "+latlng.lng();
			//alert(latlng);
			circleobj.latlng=latlng;
			
			circleobj.circleoptions={center:circleobj.latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#00FF00",map:map.googlemap,radius:circleobj.radius,strokeWeight:1};
			circleobj.circle.setOptions(circleobj.circleoptions);
		};
		return circleobj;
	};
	map.close=function(){
		//beacon manager will manage the removal of the beacons htmldiv
		var event = createevent("map close",""+map.id,map.state);
		event.id=map.id;
		map.notify(event);
	};
	return map;
}
