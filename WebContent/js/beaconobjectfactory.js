var objectstore = new Array();
var keycounter=10000;

function createbeaconmgrcs(){
	var beaconcsobj = new Object();
	beaconcsobj.mainlist=null;
	beaconcsobj.scrolllist=null;
	beaconcsobj.beaconmgrobj=null;
	beaconcsobj.maingooglemapobj=null;
	beaconcsobj.loginobj=null;
	beaconcsobj.splashobj=null;
	beaconcsobj.state=0;
	
	beaconcsobj.notification=function(eventobj){
		if(eventobj!=null){
			if(eventobj.event!=null){
				//alert("notif event  "+eventobj.event+" type "+eventobj.type+" id "+eventobj.id);
				if(eventobj.type=="listevent"){
					beaconcsobj.mainlist.setselectedid(document.getElementById(eventobj.id).getAttribute("parentid"));
					beaconcsobj.scrolllist.setselectedid(document.getElementById(eventobj.id).getAttribute("parentid"));
				}else if(eventobj.type=="login"){
					if(eventobj.event=="successfull login"){
						//alert("show more functionality");
						if(beaconcsobj.state==0){
							beaconcsobj.state=1;
							//show beacon manager and map divs
							beaconcsobj.mainlist.insertdiv(beaconcsobj.beaconmgrobj.htmlwindowdiv); //change to window
							beaconcsobj.scrolllist.insertdiv(beaconcsobj.beaconmgrobj.htmllistdiv);
							beaconcsobj.mainlist.setselectedid(beaconcsobj.beaconmgrobj.htmlwindowdiv.getAttribute("parentid"));
							beaconcsobj.scrolllist.setselectedid(beaconcsobj.beaconmgrobj.htmllistdiv.getAttribute("parentid"));
							
							/*
							 * tell beacon manager to load user beacons and messages into javascript objects 
							 * using user key  from login and json messaging
							 * 
							 * beaconmgrobj should have tranport enabled to communicate with backend
							 */
							beaconcsobj.beaconmgrobj.loaduserobjects(beaconcsobj.loginobj.publisherkey);
					}else{
							alert("already logged in");
						}
					}else if(eventobj.event=="successfull logout"){
						if(beaconcsobj.state>0){
							beaconcsobj.state=0;
							//hide beacon manager and map divs
							beaconcsobj.mainlist.removediv(beaconcsobj.beaconmgrobj.htmlwindowdiv); //change to window
							beaconcsobj.scrolllist.removediv(beaconcsobj.beaconmgrobj.htmllistdiv);
							beaconcsobj.mainlist.setselectedid(beaconcsobj.splashobj.htmldiv.getAttribute("parentid"));
							beaconcsobj.scrolllist.setselectedid(beaconcsobj.splashobj.htmllistdiv.getAttribute("parentid"));
							/*
							 * ensure that beacons are cleared out and main map circles
							 */
							beaconcsobj.beaconmgrobj.clearallbeacons();
						}else{
							alert("already logged out");
						}
					}
				}
			}else{ 
				alert("notif not event "+eventobj);
			}
		}else{
			alert("notification was null");
		}	
	};
	return beaconcsobj;
};
function addwindowtoggle(obj){
	obj.toggle=function(){
		//alert(" is "+obj.htmldiv.style.visibility);
		if(document.getElementById("main_"+obj.id)!=null && document.getElementById("main_"+obj.id).style.visibility=="visible"){
			document.getElementById("main_"+obj.id).style.visibility="hidden";
			document.getElementById("main_"+obj.id).style.display="none";
			//alert("hide it");
		}else if(document.getElementById("main_"+obj.id)!=null && document.getElementById("main_"+obj.id).style.visibility=="hidden"){
			if(document.getElementById("main_"+obj.id)!=null){
				document.getElementById("main_"+obj.id).style.visibility="visible";
				document.getElementById("main_"+obj.id).style.display="block";
			}
		}else{
			if(document.getElementById("main_"+obj.id)!=null){
				document.getElementById("main_"+obj.id).style.visibility="hidden";
				document.getElementById("main_"+obj.id).style.display="none";
			}
		}
	};
}
/*
 * object must implement the notification function to handle messages
 */
function addpublishersubscriber(object){
	object.subscribers = new Array();
	//functions
	object.addsubscriber = function(subobj){
		object.subscribers.push(subobj);
	};
	object.notify = function(msgobj){
		var tmparray = new Array();
		var sub=object.subscribers.pop();
		while(sub){
			tmparray.push(sub);
			sub.notification(msgobj);
			sub=object.subscribers.pop();
		}
		var subback=tmparray.pop();
		while(subback){
			object.subscribers.push(subback);
			subback=tmparray.pop();
		}
	};
}

/*
 * maybe possible to setup mulitple tyransport in the future
 */
function addtransport(object){
	object.sendqueue=new Array();
	object.sendbusy=false;
	object.sendjsonmessage=function(jsonmsg){
		if(!object.sendbusy){
			object.sendbusy=true;
			object.httpobj=gethttpobj();
			if(object.httpobj==null){
				alert("error getting http object to use http tranport");
				return;
			}
			object.url="BeaconEditor?jsonmessage="+jsonmsg+"&sid="+Math.random();
			object.httpobj.onreadystatechange=function(){
				if(object.httpobj.readyState==4){
					object.handlejsonmessage(object.httpobj.responseText);
					object.sendbusy=false;
					if(object.sendqueue.length>0){
						object.sendjsonmessage(object.sendqueue.pop());
					}
				}
			};
			object.httpobj.open("GET",object.url,true);
			object.httpobj.send(null);
		}else{
			object.sendqueue.push(jsonmsg);
		}
	};
};
function getnewkey(){
	return ++keycounter;
};

function settransparency(div,value,decvalue){
	if(div!=null){
		if(div.style!=null){
			div.style.filter="alpha(opacity="+value+")";
			div.style.opacity=""+decvalue;
		}
		//for(var i=0;i<div.childNodes.length;i++){
		//	settransparency(div.childNodes[i],value,decvalue);
		//}
	}
};
/*
 * support functions
 */
function getlatlngdistance(latlng1,latlng2){
	var lat1=latlng1.lat();
	var lat2=latlng2.lat();
	var lon1=latlng1.lng();
	var lon2=latlng2.lng();
	var R = 6371; // km
	var dLat = (lat2-lat1)*Math.PI/180;
	var dLon = (lon2-lon1)*Math.PI/180;
	lat1 = lat1*Math.PI/180;
	lat2 = lat2*Math.PI/180;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}
function createevent(type,msg,state){
	var eventobj = new Object();
	eventobj.type=type;
	eventobj.event=msg;
	eventobj.state=state;
	return eventobj;
};
function getpos(elem){   
    var posX = 0;   
    var posY = 0;             
    while(elem!= null){   
        posX += elem.offsetLeft;   
        posY += elem.offsetTop;   
        elem = elem.offsetParent;   
    }                              
    return { x : posX, y : posY };   
};
function gethttpobj()
{
	if (window.XMLHttpRequest)
    {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  return new XMLHttpRequest();
    }
	if (window.ActiveXObject)
	{
	  // code for IE6, IE5
	  return new ActiveXObject("Microsoft.XMLHTTP");
	}
return null;
};

