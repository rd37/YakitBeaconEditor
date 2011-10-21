function createjsonloginmsg(un,pw,register){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="LoginPublisherRequest";
	jsmsgobj.register=register;
	jsmsgobj.username=un;
	jsmsgobj.password=pw;
	return JSON.stringify(jsmsgobj);
}

function createjsonlogoutmsg(un,pw,key){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="LogoutPublisherRequest";
	jsmsgobj.publisherkey=key;
	jsmsgobj.username=un;
	jsmsgobj.password=pw;
	return JSON.stringify(jsmsgobj);
}

function createjsongetbeaconsmsg(publisherkey){
	var jsmsgobj = new Object();
	jsmsgobj.publisherkey=publisherkey;
	jsmsgobj.requesttype="ListAllBeaconRequest";
	jsmsgobj.ispublisher=true;
	return JSON.stringify(jsmsgobj);
}

function createjsongetbeaconmsg(beaconkey,publisherkey){
	var jsmsgobj = new Object();
	jsmsgobj.publisherkey=publisherkey;
	jsmsgobj.beaconkey=beaconkey;
	jsmsgobj.ispublisher=true;
	jsmsgobj.requesttype="BeaconInformationRequest";
	return JSON.stringify(jsmsgobj);
}
function createjsonbeaconupdatemsg(beacon,publisherkey){
	var jsmsgobj = new Object();
	jsmsgobj.publisherkey=publisherkey;
	jsmsgobj.requesttype="UpdateBeaconRequest";
	jsmsgobj.ispublisher=true;
	
	var beaconobj = new Object();
	beaconobj.beaconname=beacon.name;
	beaconobj.key=beacon.key;
	//NO!   beaconobj.id=beacon.id;//to identify object in object store of browser
	beaconobj.range=beacon.range;
	beaconobj.latitude=beacon.latitude;
	beaconobj.longitude=beacon.longitude;
	beaconobj.activated=beacon.activated;
	beaconobj.messagelist =new Array();
	for(var i=0;i<beacon.messages.length;i++){
		var messageinfo = new Object();
		messageinfo.text=beacon.messages[i].text;
		messageinfo.delay=beacon.messages[i].delay;
		beaconobj.messagelist.push(messageinfo);
	}
	
	jsmsgobj.beaconobj=beaconobj;
	
	return JSON.stringify(jsmsgobj);
}
