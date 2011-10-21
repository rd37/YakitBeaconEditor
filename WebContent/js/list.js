var divid=0;

var listobjectstore=new Array();

function createnewlistdiv(){
	var divelement = document.createElement("div");
	divelement.setAttribute("id", getnewlistid());
	return divelement;
}

function getnewlistid(){
	return (++divid);
}

function createlistevent(type,msg,state,id){
	var eventobj = new Object();
	eventobj.type=type;
	eventobj.event=msg;
	eventobj.state=state;
	eventobj.id=id;
	return eventobj;
};


function createlist(entries){
	var list=new Object();
	list.rootdivelement=null;
	list.scrolldivelement=null;
	list.id=null;
	list.selectedid=null;
	list.visiblespectrum=entries;
	list.startindex=0;
	list.startindexoffset=0;
	list.mousedownstartindex=0;
	list.startindexpxoffset=0;
	list.startindexpxoffset_accum=0;
	list.count=0;
	list.motionstate=0;
	list.motionvelocity=0;
	list.mousedownx;
	list.mousedowny;
	list.orientation=1;//0 is horizontal 1 is verticle
	
	//look and feel attributes
	list.fontsize=8;
	list.bgcolor="#F0C0C0";
	list.selcolor="green";
	list.divwidth=125;
	list.divheight=40;
	list.scrolling="off"; //as in currently scrolling (an internal variable) auto scrolling
	
	//autoscroll variables
	list.mass=100;//kilograms
	list.mouseupx=null;
	list.mouseupy=null;
	list.mousedowntime=null;
	list.mouseuptime=null;
	list.dampningfactor=0.5;//1.0 to 0.01
	list.scrollable=true; //as in auto scrolling
	list.mousemoveable=true;
	
	//functions
	list.updateheight=function(parentelem,height){
		if(parentelem!=null){
			var nodelist = parentelem.childNodes;
			if(nodelist!=null){
				for(var i=0;i<nodelist.length;i++){
					var node=nodelist[i];
					if(node!=null){
						if(node.style!=null){
							var success = list.updateheight(node,(height));
							if(!success){
								node.style.height=(height/2)+"px";
								return true;
							}
						}else{
						    list.updateheight(node,(height));
						}
					}else{
						return false;
					}
				}
			}
		}
		return false;
	};
	list.getElementPosition = function(elem){   
	  var posX = 0;   
	  var posY = 0;             
	  while(elem!= null){   
	    posX += elem.offsetLeft;   
	    posY += elem.offsetTop;   
	    elem = elem.offsetParent;   
	  }                              
	 return { x : posX, y : posY };   
	};  
	list.updatevisibility=function(){
		if(list.orientation==1){ //is the scroll bar indicator
			var visdisplay=0;
			if(list.visiblespectrum>list.count){
				visdisplay=list.count;
			}else{
				visdisplay=(list.visiblespectrum-1);
			}
			var ratio=visdisplay/list.count;
			var scrollerheightpx=ratio*(visdisplay*list.divheight);
			var scrollertoppospx=(list.startindex/list.count)*(visdisplay*list.divheight);
			//alert("t "+list.getElementPosition(list.rootdivelement).y );//(list.getElementPosition(list.rootdivelement).y+
			list.scrolldivelement.setAttribute("style","background-color:#C0C0C0;position:absolute;display:block;top:"+((list.getElementPosition(list.rootdivelement).y)+scrollertoppospx)+"px;left:"+(list.getElementPosition(list.rootdivelement).x+list.divwidth)+"px;visibility:visible;width:5px;height:"+(scrollerheightpx)+"px");
		}else{
			
		}
		var nodelist = list.rootdivelement.childNodes;
		//if(nodelist.length>list.visiblespectrum){
			for(var i=0;i<nodelist.length;i++){
				if(i>=(list.startindex+list.startindexoffset) && i<(list.startindex+list.visiblespectrum+list.startindexoffset)){ //show the div
					var htmlelem = nodelist[i];
					//shink and expand the first and last elements
					var absoffset=Math.abs(list.startindexpxoffset);
					if(htmlelem.getAttribute("id")==list.selectedid){
						list.bgcolorbak=list.bgcolor;
						list.bgcolor=list.selcolor;
					}
					if(list.visiblespectrum!=1){
						htmlelem.setAttribute("style","background-color:"+list.bgcolor+";position:relative;display:block;top:"+( (list.startindexpxoffset) )+"px;visibility:visible;width:"+(list.divwidth)+"px;height:"+list.divheight+"px;");
						
						if(i==(list.startindex+list.startindexoffset) && list.startindexpxoffset<0){//need to make first element disappear its off scroll window
							nodelist[i].setAttribute("style","visibility:hidden;display:block;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
						}
						if(i==(list.startindex+list.visiblespectrum+list.startindexoffset-1) && list.startindexpxoffset>0){//need to make first element disappear its off scroll window
							nodelist[i].setAttribute("style","visibility:hidden;display:block;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
						}
					}else{
						htmlelem.setAttribute("style","background-color:"+list.bgcolor+";position:relative;display:block;top:"+( (0) )+"px;visibility:visible;width:"+(list.divwidth)+"px;height:"+list.divheight+"px;");
						
					}
					if(htmlelem.getAttribute("id")==list.selectedid){
						list.bgcolor=list.bgcolorbak;
					}
				}else{//hide the div
					if(list.visiblespectrum!=1){
						if(i==(list.startindex+list.startindexoffset-1)){
							nodelist[i].setAttribute("style","position:absolute;visibility:visible;display:block;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
						}else if(i==(list.startindex+list.visiblespectrum+list.startindexoffset)){
							if(list.count>list.visiblespectrum)
								nodelist[i].setAttribute("style","position:absolute;top:"+(list.divheight*(list.visiblespectrum-1))+"px;visibility:visible;display:block;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
							else
								nodelist[i].setAttribute("style","position:absolute;top:"+(list.divheight*(list.count-1))+"px;visibility:visible;display:block;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
						}else{
							nodelist[i].setAttribute("style","position:absolute;visibility:hidden;display:none;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
						}
					}else{
						nodelist[i].setAttribute("style","visibility:hidden;display:none;width:"+(list.divwidth)+"px;height:"+list.divheight+"px");
					}
				}
			}
		//}
	};
	list.initialize=function(){
		list.rootdivelement = document.createElement("div");
		list.id = getnewlistid();
		list.rootdivelement.setAttribute("id", list.id);//font: '16pt'
		list.scrolldivelement= document.createElement("div");
		list.scrolldivelement.setAttribute("id", getnewlistid());//font: '16pt'
		list.rootdivelement.setAttribute("style","position:relative;display:block;background-color:"+list.bgcolor+";width:"+list.divwidth+"px;font-size:"+list.fontsize+"pt");
		list.rootdivelement.setAttribute("onmousemove", "listobjectstore["+list.rootdivelement.getAttribute("id")+"].mousemoved(event)");
		list.rootdivelement.setAttribute("onmousedown", "listobjectstore["+list.rootdivelement.getAttribute("id")+"].mousedown(event)");
		list.rootdivelement.setAttribute("onmouseup", "listobjectstore["+list.rootdivelement.getAttribute("id")+"].mouseup(event)");
		//list.startindexpxoffset_accum=-list.divheight+1;
	};
	list.setselectedid=function(elemid){
		//move selected to center of visible spectrum
		var nodelist = list.rootdivelement.childNodes;
		var elemindex=0;
		for(var i=0;i<nodelist.length;i++){
			//alert("Found "+nodelist[i].getAttribute("parentid"));
			if(nodelist[i].getAttribute("parentid")==elemid){
				//alert("lc "+list.count+" vs "+list.visiblespectrum);
				if(list.count>list.visiblespectrum)
					list.startindex= (i - (Math.floor(list.visiblespectrum/2)));
				list.selectedid=nodelist[i].getAttribute("id");
				list.updatevisibility();
				return;
			}
		}
		//alert("could not find wha "+elemid);
	};
	list.insertdiv=function(divelem){
		if(list.rootdivelement.firstChild!=null){
			list.rootdivelement.insertBefore(divelem,list.rootdivelement.firstChild);
		}else{
			list.rootdivelement.appendChild(divelem);
		}
		list.count++;
		divelem.setAttribute("name", divelem.getAttribute("id"));//font:6pt
		//alert("div elems setup on click look for list "+list.rootdivelement.getAttribute("id")+" show id of item "+divelem.getAttribute("id")+" done");
		divelem.setAttribute("onclick", "listobjectstore["+list.rootdivelement.getAttribute("id")+"].itemclicked('"+divelem.getAttribute("id")+"')");
		list.updatevisibility();
	};
	list.appenddiv=function(divelem){
		list.count++;
		list.rootdivelement.appendChild(divelem);
		divelem.setAttribute("name", divelem.getAttribute("id"));
		divelem.setAttribute("onclick", "listobjectstore["+list.rootdivelement.getAttribute("id")+"].itemclicked('"+divelem.getAttribute("id")+"')");
		list.updatevisibility();
	};
	list.removediv=function(divelem){
		list.count--;
		list.rootdivelement.removeChild(divelem);
		list.updatevisibility();
	};
	list.itemclicked=function(selid){
		//alert("id "+selid);
		if(list.notify!=null){
			list.notify(createlistevent("listevent","select occured",0,selid));
		}else{
			//alert("no pub sub on thhis lise");
		}
		list.selectedid=selid;
		list.updatevisibility();
	};
	list.mousedown=function(e){
		list.motionstate=1;
		list.mousedownx=e.pageX;
		list.mousedowntime=(new Date()).getTime();
		list.mousedowny=e.pageY;
		list.mousedownstartindex=list.startindex;
	};
	list.mouseout=function(e){
		list.motionstate=0;
	};
	list.mouseup=function(e){
		list.motionstate=0;
		list.startindexpxoffset_accum=list.startindexpxoffset;
		list.mouseuptime=(new Date()).getTime();
		list.mouseupx=e.pageX;
		list.mouseupy=e.pageY;
		if(list.scrolling=="off"&&list.scrollable){
			if(list.orientation==1){
				list.scrolling="on";
				var diffy=list.mousedowny-list.mouseupy;
				var difftime=list.mousedowntime-list.mouseuptime;
				var momentum=list.mass*(diffy/difftime);
				if(diffy>0){
					list.startautoscroll(Math.abs(momentum),1);
				}else if(diffy<0){
					list.startautoscroll(Math.abs(momentum),-1);
				}else{
					list.scrolling="off";
				}
			}
		}
	};
	list.mousemoved=function(e){//as mouse moves, add or remove from start index
		if(list.motionstate==1&&list.mousemoveable){
			if(list.count>list.visiblespectrum){
				if(list.orientation==1){
					var y=e.pageY;
					var diffy = y-list.mousedowny;
					var indexsdown=((diffy+list.startindexpxoffset_accum) / list.divheight);
					list.startindexpxoffset=((diffy+list.startindexpxoffset_accum)%list.divheight);
					if(indexsdown>=0)
						indexsdown = Math.floor(indexsdown);
					else
						indexsdown = Math.ceil(indexsdown);
					if(list.visiblespectrum==1){
						if(diffy>list.divheight/2){
							indexsdown=1;
							list.startindexpsoffset=0;list.startindexoffset_accum=0;
						}else if(diffy<list.divheight/2){
							list.startindexpsoffset=0;list.startindexoffset_accum=0;
							indexsdown=-1;
						}
					}
					list.startindex=list.mousedownstartindex-indexsdown;
					if(list.startindex<0){
						list.startindex=0;
					}
					
					if(list.startindex>(list.count-list.visiblespectrum)){
						list.startindex=(list.count-list.visiblespectrum);
					}
					//list.startindexpxoffset=Math.abs(list.startindexpxoffset);
				}
			}else{
				//support for horizontal lists
			}
			list.updatevisibility();
		}
	};
	list.startautoscroll=function(momentum,dir){
		if(momentum>0&&list.motionstate==0){
			momentum=momentum-list.dampningfactor;
			list.startindexpxoffset+=momentum*dir;
			var indexsdown=list.startindexpxoffset/list.divheight;
			if(indexsdown>=0){
				indexsdown = Math.floor(indexsdown);
				list.startindexoffset=1;
			}else{
				indexsdown = Math.ceil(indexsdown);
				list.startindexoffset=0;
			}
			list.startindex+=indexsdown;
			if(list.startindex<0){
				list.startindex=0;
				momentum=0;
			}
			if(list.startindex>(list.count-list.visiblespectrum)){
				list.startindex=(list.count-list.visiblespectrum);
				momentum=0;
			}
			list.startindexpxoffset=list.startindexpxoffset%list.divheight;
			list.scrollertimer=setTimeout('listobjectstore['+list.rootdivelement.getAttribute('id')+'].startautoscroll('+momentum+','+dir+')',100);
			list.updatevisibility();
		}else{
			list.scrolling="off";
		}
	};
	return list;
}