function createsplash(){
	//parameters
	var splash = new Object();
	
	splash.htmldiv=null;
	splash.htmllistdiv=null;
	
	//functions
	splash.initialize=function(){
		splash.id=getnewkey();//get new key is in beaconobjectfactory script
		splash.htmldiv=document.createElement("div");
		splash.htmldiv.setAttribute("id", "htmldiv"+splash.id);
		splash.htmldiv.setAttribute("parentid", splash.id);
		splash.htmllistdiv=document.createElement("div");
		splash.htmllistdiv.setAttribute("id", "htmllistdiv"+splash.id);//font: '16pt'
		splash.htmllistdiv.setAttribute("parentid", splash.id);
	};
	return splash;
}