
/*
 * login html pages
 */
function createloginlisthtml(scrolllist, loginobj){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/robot_sm.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td>Login</td>";
	html+="</tr>";
	html+="</table>";
	loginobj.htmllistdiv.innerHTML=html;
}

function createloginhtml(loginobj){
	var keytext = ""+loginobj.id;
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "main_"+keytext);
	var html= "<table>";
	html+=    "<tr>";
	html+=    "<td><input type='text' name='un_"+keytext+"'></input></td>"+"<td><input type='text' name='pw_"+keytext+"'></input></td>";
	html+=    "</tr>";
	html+=    "<tr><td>";
	html+=    "<input type='button' onclick='objectstore["+keytext+"].login(document.pubform.un_"+keytext+".value,document.pubform.pw_"+keytext+".value)' value='login'></input>";
	html+=    "<input type='button' onclick='objectstore["+keytext+"].register(document.pubform.un_"+keytext+".value,document.pubform.pw_"+keytext+".value)' value='register'></input>";
	html+=    "</td><td><input type='button' onclick='objectstore["+keytext+"].logout()' value='logout'></input>";
	html+=    "</td></tr>";
	html+=    "</table>";
	htmldiv.innerHTML=html;
	loginobj.htmldiv.appendChild(htmldiv);
}

/*
 * object must now implement the toggle function this function add that
 * creates a toggle able window around object
 */
function createwindow(obj){
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "win_"+obj.id);
	
	var windowhtml = "";
	windowhtml+= "<table border=0 style='min-width:300px;background-color:#C0C0C0'>";
	windowhtml+= "<tr>";
	windowhtml+= "<td align='right'><div id='wintd_"+obj.id+"' style='background-color:grey' value='hey'>";
	windowhtml+= "<table><tr><td><div id='winmsg_"+obj.id+"'></div></td><td><input type='button' onclick='objectstore["+obj.id+"].toggle()' value='_'></input></td></tr></table>";
	windowhtml+= "</div></td>";
	windowhtml+= "</tr>";
	windowhtml+= "<tr>";
	windowhtml+= "<td>";
	windowhtml+= obj.htmldiv.innerHTML;
	windowhtml+= "</td>";
	windowhtml+= "</tr>";
	windowhtml+= "</table>";
	windowhtml += "";
	htmldiv.innerHTML=windowhtml;
	//publisher.setwindowdivid(obj.divobject.divkey.value,obj.divobject);
	addwindowtoggle(obj);
	//obj.htmlwindowdiv.innerHTML=windowhtml;
	obj.htmlwindowdiv.appendChild(htmldiv);
}

/*
 * Beacon Manager Pages
 */
function createbeaconmgrhtml(beaconmgrobj){
	var keytext = ""+beaconmgrobj.id;
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "main_"+keytext);
	var html= "<table>";
	html+= "<tr><td>";
	html+=    "<table><tr><td><input type='button' onclick='objectstore["+keytext+"].addbeacon()' value='add beacon'></input></td>";
	html+=    "<td><div id='beaconlistmsg_"+keytext+"' onmouseover='objectstore["+keytext+"].showbeaconlist()'>show beacons</div></td>";
	html+=    "<td><div id='beaconlist_"+keytext+"' ></div></td></tr></table>";
	//html+=    "<td>"+beaconmgrobj.beaconslist.rootdivelement.innerHTML+"</td>";
	html+= "</td></tr>";
	html+=    "</table>";
	htmldiv.innerHTML=html;
	var htmldiv2 = document.createElement("div");
	htmldiv2.setAttribute("id", "beaconinfo_"+keytext);
	beaconmgrobj.htmldiv.appendChild(htmldiv);
	beaconmgrobj.htmldiv.appendChild(htmldiv2);
};

function createbeaconmgrlisthtml(scrolllist, beaconmgrobj){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/bordercorner.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td>Beacon Mananger</td>";
	html+="</tr>";
	html+="</table>";
	beaconmgrobj.htmllistdiv.innerHTML=html;
}

/*
 * Main Google Map pages for scrollable
 */
function createmaingooglemaplisthtml(scrolllist, googlemapobj){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/mapimg.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td>Beacon Map</td>";
	html+="</tr>";
	html+="</table>";
	googlemapobj.htmllistdiv.innerHTML=html;
}

/*
 * create html for splash screen
 */
function createsplashhtml(mainpagelist,splash){
	var html = "<img src='images/yakit.jpg' width='"+(mainpagelist.divwidth-4)+"px' height='"+(mainpagelist.divheight-4)+"px'/>";
	splash.htmldiv.innerHTML=html;
}
function createsplashlisthtml(scrolllist,splash){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/yakit.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td>about YaKit</td>";
	html+="</tr>";
	html+="</table>";
	splash.htmllistdiv.innerHTML=html;
}

/*
 * create html for the beacon form
 */
function createbeaconlisthtml(scrolllist, beaconobj){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/beaconimg.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td><div id='beacon_list_"+beaconobj.id+"'>"+beaconobj.name+"</div></td>";
	html+="</tr>";
	html+="</table>";
	beaconobj.htmllistdiv.innerHTML=html;
}

function createbeaconedithtml(beaconobj){
	var keytext = ""+beaconobj.id;
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "main_"+keytext);
	var html= "<table bgcolor='grey' width='100%'>";
	html+= "<tr><td>"; 
	html+=     "<table  width='100%'><tr>";
	html+=         "<td >beacon name</td>";
	html+=         "<td><input type='text' id='beacon_name_"+keytext+"' name='beacon_name_"+keytext+"'></input></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "<tr><td>";
	html+=     "<table >";
	html+=     "<tr><td><input type='button' onclick='objectstore["+keytext+"].addmessage()' value='add message'></input>";
	html+=	   "<td><div id='messagelistmsg_"+keytext+"' onmouseover='objectstore["+keytext+"].showmessagelist()'>show messages</div><div id='messagelist_"+keytext+"'></div></td></tr>";
	html+=     "<tr><td><div id='addmsg_"+keytext+"'></div></td></tr>";//message list div
	html+=     "</table>";
	html+= "</tr></td>";
	html+= "<tr><td>";
	html+=     "<table ><tr>";
	if(beaconobj.activated==false)
		html+=     "<td><input type='button' value='MAP' onclick='objectstore["+keytext+"].setmapposition()'></input>activate<input id='beacon_radio_"+keytext+"' type='radio' onclick='objectstore["+keytext+"].togglebeacon()'></input></td>";
	else
		html+=     "<td><input type='button' value='MAP' onclick='objectstore["+keytext+"].setmapposition()'></input>activate<input id='beacon_radio_"+keytext+"' type='radio' onclick='objectstore["+keytext+"].togglebeacon()' checked='checked'></input></td>";
	
	html+=     "<tr><td><div id='addmappos_"+keytext+"'></div></td></tr>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "<tr><td>";
	html+=     "<table  width='100%'><tr>";
	html+=     "<td><input type='button' value='close' onclick='objectstore["+keytext+"].close()' /><input type='button' value='cancel'/></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "</table>";
	htmldiv.innerHTML=html;
	var htmldiv2 = document.createElement("div");
	htmldiv2.setAttribute("id", "messageinfo_"+keytext);
	var htmldiv3 = document.createElement("div");
	htmldiv3.setAttribute("id", "mappositioninfo_"+keytext);
	beaconobj.htmldiv.appendChild(htmldiv);
	beaconobj.htmldiv.appendChild(htmldiv2);
	beaconobj.htmldiv.appendChild(htmldiv3);
}

//createmessageedithtml(message); //beacons main form div was setup in initialize adds html to beacon.divhtml
//createmessagelisthtml(messagelist,message);
/*
 * create html for the beacon form
 */
function createmessagelisthtml(scrolllist, messageobj){
	var html="<table border='0' width='"+(scrolllist.divwidth)+"'>";
	html+="<tr>";
	html+="<td><img src='images/messageimage.jpg' width='"+(scrolllist.divheight-4)+"px' height='"+(scrolllist.divheight-4)+"px'/></td>";
	html+="<td>Msg "+messageobj.id+"</td>";
	html+="</tr>";
	html+="</table>";
	messageobj.htmllistdiv.innerHTML=html;
}


/*
 * can be used by beacon or beaconmgr to set the form for use
 */
function createmessageedithtml(messageobj){
	var keytext = ""+messageobj.id;
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "main_"+keytext);
	var html= "<table style='background-color:grey' width='100%'>";
	html+= "<tr><td>"; 
	html+=     "<table width='100%'><tr>";
	html+=         "<td >Message</td>";
	html+=         "<td><input type='text' id='beacon_message_"+keytext+"' name='beacon_message_"+keytext+"'></input></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "<tr><td>"; 
	html+=     "<table width='100%'><tr>";
	html+=         "<td >Timeout</td>";
	html+=         "<td><input type='text' id='beacon_message_timeout_"+keytext+"' name='beacon_message_timeout_"+keytext+"'></input></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "<tr><td>";
	html+=     "<table  width='100%'><tr>";
	html+=     "<td><input type='button' value='close' onclick='objectstore["+keytext+"].close()' /><input type='button' value='cancel'/></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "</table>";
	messageobj.editmessagehtml=html;
	htmldiv.innerHTML=html;
	messageobj.htmldiv.appendChild(htmldiv);
}

/*
 * create html for the beacon map position works with the add beacon form
 */

function creategooglemappositionhtml(mapobj){
	var keytext = ""+mapobj.id;
	var htmldiv = document.createElement("div");
	htmldiv.setAttribute("id", "main_"+keytext);
	var html= "<table style='background-color:grey' width='100%'>";
	html+= "<tr><td>"; 
	html+=     "<table style='background-color:grey' width='100%'><tr>";
	html+=         "<td><div id='beacon_map_"+keytext+"' style='width:235px;height:125px'>..............</div></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "<tr><td>";
	html+=     "<table style='background-color:grey' width='100%'><tr>";
	html+=     "<td><input type='button' value='close' onclick='objectstore["+keytext+"].close()'/><input type='button' value='cancel'/></td>";
	html+=     "</tr></table>";
	html+= "</td></tr>";
	html+= "</table>";
	htmldiv.innerHTML=html;
	mapobj.htmldiv.appendChild(htmldiv);
}

