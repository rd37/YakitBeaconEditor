function createlogin(){
	var loginobj = new Object();
	loginobj.username="";
	loginobj.password="";
	loginobj.publisherkey=-1;
	loginobj.id=null;
	loginobj.state=null;
	loginobj.notify=null;//from publisher subscriber
	//loginobj.divobject=creatediv();//the id is set obj.divkey parameter
	//loginobj.loginhtml="";
	loginobj.htmldiv=null;
	loginobj.htmllistdiv=null;
	loginobj.htmlwindowdiv=null;
	
	loginobj.initialize=function(){
		loginobj.state=0;
		loginobj.id=getnewkey();//get new key is in beaconobjectfactory script
		loginobj.htmldiv=document.createElement("div");
		loginobj.htmldiv.setAttribute("id", "htmldiv"+loginobj.id);
		loginobj.htmldiv.setAttribute("parentid", loginobj.id);
		loginobj.htmllistdiv=document.createElement("div");
		loginobj.htmllistdiv.setAttribute("id", "htmllistdiv"+loginobj.id);//font: '16pt'
		loginobj.htmllistdiv.setAttribute("parentid", loginobj.id);
		loginobj.htmlwindowdiv=document.createElement("div");
		loginobj.htmlwindowdiv.setAttribute("id", "htmlwindowdiv"+loginobj.id);//font: '16pt'
		loginobj.htmlwindowdiv.setAttribute("parentid", loginobj.id);
	};
	loginobj.handlejsonmessage=function(jsonmsg){ //from transport
		//alert(jsonmsg+":"+loginobj.state);
		var jsmsg = JSON.parse(jsonmsg);
		
		if(loginobj.state==1){//must be waiting for registeration request
			//alert("do register stuff");
			if(jsmsg.result.success){
				loginobj.state=2;
				loginobj.publisherkey=jsmsg.key;
				if(document.getElementById("wintd_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:yellow;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Registration Successful";
					
				}
			}else{
				loginobj.state=0;
				if(document.getElementById("winmsg_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:red;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Registration Unsuccessful";
					
				}
			}
		}else if(loginobj.state==2){
			
			if(jsmsg.result.success){
				loginobj.state=4;
				loginobj.publisherkey=jsmsg.key;
				if(document.getElementById("winmsg_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:green;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Login Successful";
				}
				
				if(loginobj.notify!=null)
					loginobj.notify(createevent("login","successfull login",2));
				
			}else{
				loginobj.state=0;
				if(document.getElementById("winmsg_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:red;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Login Unsuccessful";
					
				}
			}
		}else if(loginobj.state==3){
			//alert("now set logout color");
			if(jsmsg.success){
				loginobj.state=0;
				loginobj.publisherkey=jsmsg.key;
				
				if(document.getElementById("winmsg_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:red;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Logout Successful";
					
				}
				if(loginobj.notify!=null)
					loginobj.notify(createevent("login","successfull logout",0));
			}else{
				loginobj.state=0;
				if(document.getElementById("winmsg_"+loginobj.id)!=null){
					document.getElementById("wintd_"+loginobj.id).setAttribute("style","background-color:red;");
					document.getElementById("winmsg_"+loginobj.id).innerHTML="Logout Unuccessful";
					
				}
			}
		}
	};
	//functions
	loginobj.login=function(un,pw){
		if(loginobj.state!=4){
			//alert("login with "+un+","+pw+" using json request");
			var jsonloginmsg = createjsonloginmsg(un,pw,false);
			//alert(jsonloginmsg);
			loginobj.username=un;
			loginobj.password=pw;
			loginobj.state=2;
			loginobj.sendjsonmessage(jsonloginmsg);
		}
	};
	loginobj.register=function(un,pw){
		if(loginobj.state==0){
			//alert("register with "+un+","+pw+" using json request");
			var jsonregmsg = createjsonloginmsg(un,pw,true);
			//alert(jsonregmsg);
			loginobj.state=1;
			loginobj.sendjsonmessage(jsonregmsg);
		}
	};
	loginobj.logout=function(){
		if(loginobj.state==4){
			//alert("logout with using json request");
			var jsonlogoutmsg = createjsonlogoutmsg(loginobj.username,loginobj.password,loginobj.publisherkey);
			//alert(jsonlogoutmsg);
			loginobj.state=3;
			loginobj.sendjsonmessage(jsonlogoutmsg);
		}
	};
	return loginobj;
}