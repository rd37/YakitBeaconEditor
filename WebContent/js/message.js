function createmessage(){
	var message = new Object();
	message.text="black";
	message.delay=5;
	message.id=null;
	
	message.htmldiv=null;
	message.htmllistdiv=null;
	message.htmlwindowdiv=null;
	
	//message functions
	message.initialize=function(){
		//initialize the html divs of this object
		message.id=getnewkey();//get new key is in beaconobjectfactory script
		message.htmldiv=document.createElement("div");
		message.htmldiv.setAttribute("id", "htmldiv"+message.id);
		message.htmldiv.setAttribute("parentid", message.id);
		message.htmllistdiv=document.createElement("div");
		message.htmllistdiv.setAttribute("id", "htmllistdiv"+message.id);//font: '16pt'
		message.htmllistdiv.setAttribute("parentid", message.id);
		message.htmlwindowdiv=document.createElement("div");
		message.htmlwindowdiv.setAttribute("id", "htmlwindowdiv"+message.id);//font: '16pt'
		message.htmlwindowdiv.setAttribute("parentid", message.id);
	};
	message.settext=function(newtext){
		message.text=newtext;
	};
	message.setdelay=function(newdelay){
		message.delay=newdelay;
	};
	message.close=function(){
		//beacon manager will manage the removal of the beacons htmldiv
		//update page values
		message.text = document.getElementById("beacon_message_"+message.id).value;
		message.delay = document.getElementById("beacon_message_timeout_"+message.id).value;
		var event = createevent("message close",""+message.id,message.state);
		event.id = message.id;
		message.notify(event);
	};
	return message;
};