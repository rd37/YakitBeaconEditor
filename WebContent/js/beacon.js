function createbeacon(){
	//create beacon and then create a new transport for the beacon object
	var beacon = new Object();
	beacon.messages=new Array();
	beacon.messagelist=null;
	beacon.state=0;
	beacon.mapstate=0;
	beacon.id=null;
	beacon.name=null;
	beacon.latitude=null;
	beacon.longitude=null;
	beacon.range=null;
	beacon.map=null;
	beacon.mainmapcircle=null;
	beacon.infowindow=null;
	beacon.key = -1;
	beacon.activated=false;
	
	beacon.htmldiv=null;
	beacon.htmllistdiv=null;
	beacon.htmlwindowdiv=null;
	
	beacon.togglebeacon=function(){
		//alert("Toggle Beacon");
		/*
		 * update backend to turn on/off i.e send beacon update message
		 * send back-end request
		 * 
		 * on recive of result, set form
		 */
		if(beacon.activated==false){
			beacon.activated=true;
			document.getElementById("beacon_radio_"+beacon.id).checked=true;
		}else{
			beacon.activated=false;
			document.getElementById("beacon_radio_"+beacon.id).checked=false;
		}
		
		//now when the beacon form is closed, the beacon should activate
		
	};
	beacon.createmessage=function(){
		var message = createmessage();
		message.initialize();
		objectstore[message.id]=message;
		createmessageedithtml(message); //beacons main form div was setup in initialize adds html to beacon.divhtml
		createmessagelisthtml(beacon.messagelist,message);
		beacon.messages.push(message);
		beacon.messagelist.insertdiv(message.htmllistdiv);
		//beacon.setmessagelistvisible();
		addpublishersubscriber(message);
		message.addsubscriber(beacon);
		return message;
	};
	beacon.notification=function(eventmsg){
		//alert("beacon recieved a notif event  "+eventmsg.event+" type "+eventmsg.type+" id "+eventmsg.id);
		if(eventmsg!=null){
			if(eventmsg.event!=null){
				//alert("notif event  "+eventobj.event+" type "+eventobj.type+" id "+eventobj.id);
				if(eventmsg.type=="listevent"){//from beacon lists
					//alert("beacon mgr notif event "+eventmsg.event+" type "+eventmsg.type+" id "+eventmsg.id);
					if(eventmsg.event=="select occured"){
						while(document.getElementById("messageinfo_"+beacon.id).childNodes[0]!=null){
							document.getElementById("messageinfo_"+beacon.id).removeChild(document.getElementById("messageinfo_"+beacon.id).childNodes[0]);
						}
						var message = beacon.getmessage(document.getElementById(eventmsg.id).getAttribute("parentid"));
						
						/*
						 * add message dive to message info div of the beacon form, this makes the message 
						 * appear, then you can manuever it around the screen
						 * the html div once it is appended needs to have its entries updated with message 
						 * object parameters, i.e. text and delay information
						 */
						document.getElementById("messageinfo_"+beacon.id).appendChild(message.htmldiv);//makes message for visible on screen
						//populate form with message object data i.e. text and delay information
						document.getElementById("beacon_message_"+message.id).value=message.text;
						document.getElementById("beacon_message_timeout_"+message.id).value=message.delay;
						//postion message form around the screen
						message.htmldiv.style.position="absolute";
						//alert(getpos(document.getElementById("main_"+beaconmgr.id)).y);
						message.htmldiv.style.top=(getpos(document.getElementById("main_"+beacon.id)).y-20)+"px";
						message.htmldiv.style.left=(getpos(document.getElementById("main_"+beacon.id)).x+10)+"px";
						beacon.hidemessagelist();
						settransparency(document.getElementById("main_"+beacon.id),50,0.5);
						//settransparency(beacon.htmldiv,80,0.8);
					}
				}if(eventmsg.type=="message close"){
					settransparency(document.getElementById("main_"+beacon.id),100,1.0);
					document.getElementById("messageinfo_"+beacon.id).removeChild(beacon.getmessage(eventmsg.event).htmldiv);
					beacon.notify(eventmsg);
				}
				if(eventmsg.type=="map close"){
					settransparency(document.getElementById("main_"+beacon.id),100,1.0);
					document.getElementById("mappositioninfo_"+beacon.id).removeChild(beacon.map.htmldiv);
					var latlng = beacon.map.circle.circle.center;
					var radius = beacon.map.circle.circle.radius;
					beacon.latitude=latlng.lat();
					beacon.longitude=latlng.lng();
					beacon.range=radius;
					beacon.notify(eventmsg);
				}
			}else{ 
				alert("beacon notif not event "+eventobj);
			}
		}else{
			alert(" beacon notification was null");
		}	
		//beacon.notify(eventmsg);
	};
	beacon.getmessage=function(b_id){
		for(var i=0;i<beacon.messages.length;i++){
			//alert("found "+beaconmgr.beacons[i].id+" l4 "+b_id);
			if(beacon.messages[i].id==b_id)
				return beacon.messages[i];
		}	
	};
	beacon.initialize=function(){
		//init beacon position and range
		beacon.range=10;
		beacon.latitude=48.4633;
		beacon.longitude=-123.3133;
		beacon.name="a beacon";
		//initialize the html divs of this object
		beacon.id=getnewkey();//get new key is in beaconobjectfactory script
		beacon.htmldiv=document.createElement("div");
		beacon.htmldiv.setAttribute("id", "htmldiv"+beacon.id);
		beacon.htmldiv.setAttribute("parentid", beacon.id);
		beacon.htmllistdiv=document.createElement("div");
		beacon.htmllistdiv.setAttribute("id", "htmllistdiv"+beacon.id);//font: '16pt'
		beacon.htmllistdiv.setAttribute("parentid", beacon.id);
		beacon.htmlwindowdiv=document.createElement("div");
		beacon.htmlwindowdiv.setAttribute("id", "htmlwindowdiv"+beacon.id);//font: '16pt'
		beacon.htmlwindowdiv.setAttribute("parentid", beacon.id);
		
		//create message list for the beacon to store messages
		beacon.messagelist = createlist(4);
		beacon.messagelist.divwidth=90;
		beacon.messagelist.divheight=20;
		beacon.messagelist.bgcolor="#F1F1F1";
		beacon.messagelist.selcolor="#E1E1E1";
		beacon.messagelist.initialize();
		
		listobjectstore[beacon.messagelist.rootdivelement.getAttribute("id")]=beacon.messagelist;
		beacon.messagelist.rootdivelement.style.position="absolute";
		beacon.messagelist.rootdivelement.style.visibility="hidden";
		addpublishersubscriber(beacon.messagelist);
		beacon.messagelist.addsubscriber(beacon);
		
		beacon.map=creategooglemap();
		beacon.map.initialize();
		
		objectstore[beacon.map.id]=beacon.map;
		addpublishersubscriber(beacon.map);
		beacon.map.addsubscriber(beacon);
		
		creategooglemappositionhtml(beacon.map);
	};
	beacon.close=function(){
		//beacon manager will manage the removal of the beacons htmldiv
		//mean time get htmldiv information and copy to beacon object
		//i.e. lat lng range beacon name;
		beacon.name=document.getElementById("beacon_name_"+beacon.id).value;
		if(beacon.map.circle!=null){
			beacon.latitude=beacon.map.circle.circle.center.lat();
			beacon.longitude=beacon.map.circle.circle.center.lng();
			beacon.range=beacon.map.circle.circle.radius;
		}
		//alert("beacon close, save "+beacon.name+","+beacon.latitude+","+beacon.longitude+","+beacon.range);
		var event =createevent("beacon close",""+beacon.id,beacon.state);
		event.id=beacon.id;
		beacon.notify(event);
	};
	beacon.showmessagelist=function(){
		if(document.getElementById("messagelist_"+beacon.id).childNodes[0]==null){
			document.getElementById("messagelist_"+beacon.id).appendChild(beacon.messagelist.rootdivelement);
		}
		if(beacon.messagelist.rootdivelement.style.visibility=="hidden"){
			beacon.messagelist.rootdivelement.style.visibility="visible";
			beacon.messagelist.rootdivelement.style.display="block";
			document.getElementById("messagelistmsg_"+beacon.id).innerHTML="hide messages";
		}else{
			beacon.hidemessagelist();
		}
	};
	beacon.hidemessagelist=function(){
		beacon.messagelist.rootdivelement.style.visibility="hidden";
		beacon.messagelist.rootdivelement.style.display="none";
		document.getElementById("messagelistmsg_"+beacon.id).innerHTML="show messages";
	};
	beacon.addmessage=function(){
		var message = createmessage();
		message.initialize();
		objectstore[message.id]=message;
		createmessageedithtml(message); //beacons main form div was setup in initialize adds html to beacon.divhtml
		createmessagelisthtml(beacon.messagelist,message);
		beacon.messages.push(message);
		beacon.messagelist.insertdiv(message.htmllistdiv);
		beacon.setmessagelistvisible();
		addpublishersubscriber(message);
		message.addsubscriber(beacon);
	};
	beacon.setmessagelistvisible=function(){
		if(document.getElementById("messagelist_"+beacon.id).childNodes[0]==null){
			document.getElementById("messagelist_"+beacon.id).appendChild(beacon.messagelist.rootdivelement);
		}
		if(beacon.messagelist.rootdivelement.style.visibility=="hidden"){
			beacon.messagelist.rootdivelement.style.visibility="visible";
			beacon.messagelist.rootdivelement.style.display="block";
			document.getElementById("messagelistmsg_"+beacon.id).innerHTML="hide beacons";
		}
	};
	beacon.removemessage=function(){
		alert("remove message");
	};
	beacon.handlecirclemousedown=function(event){
		/*
		 * retrieve map click events lat and lng
		 * change cirlces center lat and lng
		 * set beacons lat and lng
		 */
		alert("beacon circle down");
	};
	beacon.handlecirclemouseup=function(event){
		alert("becaon map circle up lat "+event.latLng.lat()+" lng "+event.latLng.lng());
	};
	beacon.handlecirclemousemove=function(event){
		alert("becaon map circle move");
	};
	beacon.setmapposition=function(){//called when ever the map button is pressed
		//show map on screen use beacon_map_b#ID to access location
		while(document.getElementById("mappositioninfo_"+beacon.id).childNodes[0]!=null){
			document.getElementById("mappositioninfo_"+beacon.id).removeChild(document.getElementById("mappositioninfo_"+beacon.id).childNodes[0]);
		}
		
		beacon.map.htmldiv.style.position="absolute";
		//alert(getpos(document.getElementById("main_"+beaconmgr.id)).y);
		beacon.map.htmldiv.style.top=(getpos(document.getElementById("main_"+beacon.id)).y-70)+"px";
		beacon.map.htmldiv.style.left=(getpos(document.getElementById("main_"+beacon.id)).x+15)+"px";
		beacon.hidemessagelist();
		settransparency(document.getElementById("main_"+beacon.id),50,0.5);
		
		document.getElementById("mappositioninfo_"+beacon.id).appendChild(beacon.map.htmldiv);
		if(beacon.map.googlemap==null)
			beacon.map.initializediv(document.getElementById("beacon_map_"+beacon.map.id));
		if(beacon.map.googlemap==null){
			alert("map is null");
			return;
		}	
		
		if(beacon.map.circle==null){
			/*
			 * since map is also just a regular map, decision need to be made at the beacon object
			 * not the map object, map state is meaningless so beacon must maintain state of the map 
			 * with respect the the mouse motion and clicking events.  therefore map state is controlled and only has
			 * meaning to the beacon object.
			 */
			beacon.map.circle=beacon.map.createnewgooglecircle(beacon.range,beacon.latitude,beacon.longitude);
			
			/*
			 * resize events
			 */
			google.maps.event.addListener(beacon.map.circle.circle,'click',function(event){
				//alert("clicl occured bf"+beacon.mapstate);
				if(beacon.mapstate==0){
					beacon.mapstate=1;
				}else if(beacon.mapstate==2){
					beacon.mapstate==1;
				}else if(beacon.mapstate==1){
					beacon.map.circle.move(event.latLng);
					beacon.mapstate=0;
				}
				//document.getElementById("monitor1").innerHTML="map state "+beacon.mapstate;
			});
			google.maps.event.addListener(beacon.map.circle.circle,'rightclick',function(event){
				//alert("up evnet");
				if(beacon.mapstate==0){
					beacon.mapstate=2;
				}else if(beacon.mapstate==1){
					beacon.mapstate=2;
				}else if(beacon.mapstate==2){
					beacon.mapstate=0;
				}
				//document.getElementById("monitor1").innerHTML="map state "+beacon.mapstate;
			});
			google.maps.event.addListener(beacon.map.googlemap,'mousemove',function(event){
				//alert("clicl occured bf"+beacon.mapstate);
				if(beacon.mapstate==1){
					beacon.map.circle.move(event.latLng);
				}else if(beacon.mapstate==2){
					beacon.map.circle.resize(event.latLng);
				}
				//document.getElementById("monitor1").innerHTML="map state "+beacon.mapstate;
			});
			google.maps.event.addListener(beacon.map.circle.circle,'mousemove',function(event){
				//alert("clicl occured bf"+beacon.mapstate);
				if(beacon.mapstate==1){
					//beacon.map.circle.move(event.latLng);
				}else if(beacon.mapstate==2){
					beacon.map.circle.resize(event.latLng);
				}
				//document.getElementById("monitor1").innerHTML="map state "+beacon.mapstate;
			});
		}else{
			//beacon.map.showcircle();
		}
		
	};
	
	return beacon;
};
