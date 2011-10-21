function createbeaconmanager(){
	//parameters
	var beaconmgr = new Object();
	beaconmgr.beacons = new Array();
	beaconmgr.beaconslist=null;
	
	beaconmgr.htmldiv=null;
	beaconmgr.htmllistdiv=null;
	beaconmgr.htmlwindowdiv=null;
	
	beaconmgr.state=0;
	beaconmgr.publisherkey=null;
	beaconmgr.beacontoupdate=null;
	
	//functions
	beaconmgr.clearallbeacons=function(){
		for(var i=0;i<beaconmgr.beacons.length;i++){
			if(beaconmgr.beacons[i].mainmapcircle!=null)//if beacon had a main map circle, remove it as well
				beaconmgr.beacons[i].mainmapcircle.circle.setMap(null);
			beaconmgr.beaconslist.removediv(beaconmgr.beacons[i].htmllistdiv);//remove beacon list elements
		}
		beaconmgr.beacons = new Array();
		//beaconmgr.beaconslist=null;
	};
	beaconmgr.handlejsonmessage=function(jsonmsg){ //from transport
		//alert(jsonmsg+":"+beaconmgr.state);
		var jsmsg = JSON.parse(jsonmsg);
		/*
		 * now populate the beacons manager list of beacons
		 */
		if(jsmsg!=null){
			if(jsmsg.msgtype=="ListBeaconsReturn"){//called when use first logs in, returns a list of beacon keys
				/*
				 * for each beacon key, do a get Beacon message which
				 * returns a BeaconInfoReturn.
				 * Use beacon info return to update or create beacons parameters and messages.
				 * 
				 * in param beaconkeys
				 */
				var keyarray = jsmsg.beaconkeys;
				
				//alert("got list of beacon keys, now send request for information on each of them "+keyarray.length);
				for(var i=0;i<keyarray.length;i++){
					beaconmgr.sendjsonmessage(createjsongetbeaconmsg(keyarray[i],beaconmgr.publisherkey));
					//alert("get beacon "+i);
				}
				//alert("done");
			}else if(jsmsg.msgtype=="UpdateBeaconReturn"){//return beacon key with new update information
				/* dont have to do this
				 * Use key to get beacon information return type will be BeaconInfoReturn
				 */
				var beaconkey=jsmsg.beacon_key;
				beaconmgr.beacontoupdate.key=beaconkey;
				/*beaconmgr.sendjsonmessage(createjsongetbeaconmsg(beaconkey,beaconmgr.publisherkey));*/
				//alert("beacon updated "+jsmsg.beacon_key);
			}else if(jsmsg.msgtype=="BeaconInfoReturn"){//return beacon key with new update information
				var beaconkey = jsmsg.beacon_key;
				var beacon = beaconmgr.getbeaconbykey(beaconkey);
				if(beacon==null){ //
					//alert("create beacon and its messages "+jsmsg.beacon_key);
					/*
					 * create the beacon
					 * 		set contents
					 * create its beacon messages
					 * 		set contents 
					 */
					var beacon = beaconmgr.createbeacon(jsmsg.beacon_name,jsmsg.beacon_activated);
					beacon.name=jsmsg.beacon_name;
					//bad fix to set beacon name in beacon list.html
					//beacon.setnamedivlist(beacon.name);
					beacon.latitude=jsmsg.beacon_latitude;
					beacon.longitude=jsmsg.beacon_longitude;
					beacon.range=jsmsg.beacon_range;
					beacon.activated=jsmsg.beacon_activated;
					//alert("change old beacon key "+beacon.key+" to new key "+jsmsg.beacon_key);
					beacon.key=jsmsg.beacon_key;
					//update messages
					var messagelist=jsmsg.beacon_messages;
					for(var i=0;i<messagelist.length;i++){
						var message = beacon.createmessage();
						message.settext(messagelist[i].message);
						message.setdelay(messagelist[i].timeout);
					}
					
					//update main google map send beacon notify event
					//need to noitfy the main google map to show the dot
					var event =createevent("beacon close",""+beacon.id,beacon.state);
					event.id=beacon.id;
					beaconmgr.notify(event);
				}
			}
		}
	};
	beaconmgr.createbeacon=function(name,activated){
		var beacon = createbeacon();
		beacon.initialize();
		if(name!=null){
			beacon.name=name;
			beacon.activated=activated;
		}
		objectstore[beacon.id]=beacon;
		createbeaconedithtml(beacon); //beacons main form div was setup in initialize adds html to beacon.divhtml
		createbeaconlisthtml(beaconmgr.beaconslist,beacon);
		beaconmgr.beacons.push(beacon);
		beaconmgr.beaconslist.insertdiv(beacon.htmllistdiv);
		//beaconmgr.setbeaconlistvisible();
		addpublishersubscriber(beacon);
		beacon.addsubscriber(beaconmgr);
		return beacon;
	};
	beaconmgr.loaduserobjects=function(publisherkey){
		/*
		 * place json call to get all beacons and their messages
		 */
		var jsmsgstring = createjsongetbeaconsmsg(publisherkey);
		beaconmgr.sendjsonmessage(jsmsgstring);
		beaconmgr.publisherkey=publisherkey;
	};
	beaconmgr.notification=function(eventmsg){ //will receive event messages from beacons and its own beaconslist
		if(eventmsg!=null){
			if(eventmsg.event!=null){
				//alert("notif event  "+eventobj.event+" type "+eventobj.type+" id "+eventobj.id);
				if(eventmsg.type=="listevent"){//from beacon lists
					//alert("beacon mgr notif event "+eventmsg.event+" type "+eventmsg.type+" id "+eventmsg.id);
					if(eventmsg.event=="select occured"){
						while(document.getElementById("beaconinfo_"+beaconmgr.id).childNodes[0]!=null){
							document.getElementById("beaconinfo_"+beaconmgr.id).removeChild(document.getElementById("beaconinfo_"+beaconmgr.id).childNodes[0]);
						}
						var beacon = beaconmgr.getbeacon(document.getElementById(eventmsg.id).getAttribute("parentid"));
						
						/*
						 * need to show beacon form to screen 
						 * then populate form with beacon object information
						 * then position form relative to manager form
						 */
						document.getElementById("beaconinfo_"+beaconmgr.id).appendChild(beacon.htmldiv);//show beacon form to screen
						
						document.getElementById("beacon_name_"+beacon.id).value=beacon.name;//update beacon name in form
						
						beacon.htmldiv.style.position="absolute";
						//alert(getpos(document.getElementById("main_"+beaconmgr.id)).y);
						beacon.htmldiv.style.top=(getpos(document.getElementById("main_"+beaconmgr.id)).y)+"px";
						beaconmgr.hidebeaconlist();
						settransparency(document.getElementById("main_"+beaconmgr.id),50,0.5);
						//settransparency(beacon.htmldiv,80,0.8);
					}
				}if(eventmsg.type=="beacon close"){
					settransparency(document.getElementById("main_"+beaconmgr.id),100,1.0);
					if(document.getElementById("beaconinfo_"+beaconmgr.id)!=null){
						var beacon=beaconmgr.getbeacon(eventmsg.event);
						document.getElementById("beaconinfo_"+beaconmgr.id).removeChild(beaconmgr.getbeacon(eventmsg.event).htmldiv);
						//update beacons list div
						if(document.getElementById("beacon_list_"+beacon.id)!=null)
							document.getElementById("beacon_list_"+beacon.id).innerHTML=beacon.name;
						else
							alert("becan list div not found");
						
						/*
						 * now update back end with beacon information
						 */
						beaconmgr.beacontoupdate=beaconmgr.getbeacon(eventmsg.event);
						var jsmsgstring = createjsonbeaconupdatemsg(beaconmgr.beacontoupdate,beaconmgr.publisherkey);
						//alert("sending beacon update in json "+jsmsgstring);
						beaconmgr.sendjsonmessage(jsmsgstring);
					}
				}
			}else{ 
				alert("notif not event "+eventobj);
			}
		}else{
			alert("notification was null");
		}	
		beaconmgr.notify(eventmsg);
	};
	/*
	 * this function is a waste since beacons can be found by b_id in the objectstore[b_id] !
	 */
	beaconmgr.getbeaconbykey=function(b_key){
		for(var i=0;i<beaconmgr.beacons.length;i++){
			//alert("found "+beaconmgr.beacons[i].id+" l4 "+b_id);
			if(beaconmgr.beacons[i].key==b_key)
				return beaconmgr.beacons[i];
		}	
		return null;
	};
	beaconmgr.getbeacon=function(b_id){
		for(var i=0;i<beaconmgr.beacons.length;i++){
			//alert("found "+beaconmgr.beacons[i].id+" l4 "+b_id);
			if(beaconmgr.beacons[i].id==b_id)
				return beaconmgr.beacons[i];
		}	
	};
	beaconmgr.initialize=function(){
		beaconmgr.state=0;
		beaconmgr.id=getnewkey();//get new key is in beaconobjectfactory script
		beaconmgr.htmldiv=document.createElement("div");
		beaconmgr.htmldiv.setAttribute("id", "htmldiv"+beaconmgr.id);
		beaconmgr.htmldiv.setAttribute("parentid", beaconmgr.id);
		beaconmgr.htmllistdiv=document.createElement("div");
		beaconmgr.htmllistdiv.setAttribute("id", "htmllistdiv"+beaconmgr.id);//font: '16pt'
		beaconmgr.htmllistdiv.setAttribute("parentid", beaconmgr.id);
		beaconmgr.htmlwindowdiv=document.createElement("div");
		beaconmgr.htmlwindowdiv.setAttribute("id", "htmlwindowdiv"+beaconmgr.id);//font: '16pt'
		beaconmgr.htmlwindowdiv.setAttribute("parentid", beaconmgr.id);
		//create beacon list object
		beaconmgr.beaconslist = createlist(4);
		beaconmgr.beaconslist.divwidth=90;
		beaconmgr.beaconslist.divheight=20;
		beaconmgr.beaconslist.bgcolor="#F1F1F1";
		beaconmgr.beaconslist.selcolor="#E1E1E1";
		beaconmgr.beaconslist.initialize();
		
		listobjectstore[beaconmgr.beaconslist.rootdivelement.getAttribute("id")]=beaconmgr.beaconslist;
		beaconmgr.beaconslist.rootdivelement.style.position="absolute";
		beaconmgr.beaconslist.rootdivelement.style.visibility="hidden";
		addpublishersubscriber(beaconmgr.beaconslist);
		beaconmgr.beaconslist.addsubscriber(beaconmgr);
	};
	beaconmgr.addbeacon=function(){
		var beacon = createbeacon();
		beacon.initialize();
		objectstore[beacon.id]=beacon;
		createbeaconedithtml(beacon); //beacons main form div was setup in initialize adds html to beacon.divhtml
		createbeaconlisthtml(beaconmgr.beaconslist,beacon);
		beaconmgr.beacons.push(beacon);
		beaconmgr.beaconslist.insertdiv(beacon.htmllistdiv);
		beaconmgr.setbeaconlistvisible();
		addpublishersubscriber(beacon);
		beacon.addsubscriber(beaconmgr);
		var event = createevent("beacon manager event","beacon created",beaconmgr.state	);
		event.id=beacon.id;//beacons are in object store
		beaconmgr.notify(event);
	};
	beaconmgr.setbeaconlistvisible=function(){
		if(document.getElementById("beaconlist_"+beaconmgr.id).childNodes[0]==null){
			document.getElementById("beaconlist_"+beaconmgr.id).appendChild(beaconmgr.beaconslist.rootdivelement);
		}
		if(beaconmgr.beaconslist.rootdivelement.style.visibility=="hidden"){
			beaconmgr.beaconslist.rootdivelement.style.visibility="visible";
			beaconmgr.beaconslist.rootdivelement.style.display="block";
			document.getElementById("beaconlistmsg_"+beaconmgr.id).innerHTML="hide beacons";
		}
	};
	beaconmgr.showbeaconlist=function(){
		if(document.getElementById("beaconlist_"+beaconmgr.id).childNodes[0]==null){
			document.getElementById("beaconlist_"+beaconmgr.id).appendChild(beaconmgr.beaconslist.rootdivelement);
		}
		if(beaconmgr.beaconslist.rootdivelement.style.visibility=="hidden"){
			beaconmgr.beaconslist.rootdivelement.style.visibility="visible";
			beaconmgr.beaconslist.rootdivelement.style.display="block";
			document.getElementById("beaconlistmsg_"+beaconmgr.id).innerHTML="hide beacons";
		}else{
			beaconmgr.hidebeaconlist();
		}
	};
	beaconmgr.hidebeaconlist=function(){
		beaconmgr.beaconslist.rootdivelement.style.visibility="hidden";
		beaconmgr.beaconslist.rootdivelement.style.display="none";
		document.getElementById("beaconlistmsg_"+beaconmgr.id).innerHTML="show beacons";
	};
	return beaconmgr;
};
