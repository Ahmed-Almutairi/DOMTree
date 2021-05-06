
let canvas = document.querySelector("#canvas");
let context=canvas.getContext('2d');
let y=50;
let x=canvas.width/2;
let indexOnLevel=[];
let btn=document.getElementById("btn");

function getXY(canvas, event){ //shape 
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left 
    return {x:x, y:y}
  }

function getNodesPerLevel(row) {
    return row <= 0 ? 1 : _getNodesPerLevel(document, row)
}
function _getNodesPerLevel(e, row) {
    if (row == 0)
        return "childNodes" in e ? nonEmptyNodes(e) : 0;
    else if (!("childNodes" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.childNodes.length; i++)
        total += _getNodesPerLevel(e.childNodes[i], row - 1)
    return total;
}
function nonEmptyNodes(e) {
    let total = 0
    for (let i = 0; i < e.childNodes.length; i++) {
        if (e.childNodes[i].nodeType == Node.TEXT_NODE && e.childNodes[i].data.trim() == "") continue;
        else total++;
    }
    return total;
}

function node(e,x,y,level,mouse_clickX = -1,mouse_clickY = -1) {
    let numberOfchildren=getNodesPerLevel(level);
    let section=canvas.width/numberOfchildren;
    context.textAlign = "center"
    
    
    if(e.length==0)return;

    
       for (let i = 0; i < e.length; i++) {

       
        if (e[i].nodeType == Node.TEXT_NODE && e[i].data.trim() == "") continue;
       
        if(indexOnLevel[level]== undefined) indexOnLevel[level]=0;
        else indexOnLevel[level]++;
                  
        
            context.beginPath();
            
            if (e[i].nodeType != Node.TEXT_NODE){
                //context.fillStyle=""
                
            context.arc((section/2+(indexOnLevel[level]*(section))), y, 30, 0,360 , false);
            
            if(mouse_clickX>((section/2+(indexOnLevel[level]*(section)))-20) && 
            mouse_clickX<((section/2+(indexOnLevel[level]*(section)))+20) &&
            mouse_clickY>y-20 &&
            mouse_clickY<y+20){
                var tagElement = prompt("Please enter your Element", "");
                if(tagElement!= "" && tagElement!=null){
                var nodeTag = document.createElement(tagElement);
                e[i].appendChild(nodeTag);
            }
            }
            
         
        }
            else
            context.rect((section/2+(indexOnLevel[level]*(section)))-20, y-30, 50, 50);
            context.font = "10px normal";
            context.fillText(e[i].nodeName.toLowerCase().replace("#", ""), (section/2+(indexOnLevel[level]*(section))), y, 20);
           
            context.stroke();
            if(e[i].childNodes.length!=0){
               
                const pathPlus = new Path2D()
               
                pathPlus.rect((section/2+(indexOnLevel[level]*(section)))+20, y-30, 20, 10)
                
                context.fillStyle = "#858383"
                
                context.fill(pathPlus)
                 
                context.font = "10px normal";
                
                context.fillText("+",(section/2+(indexOnLevel[level]*(section)))+20, y-30,20)
               
                context.stroke(pathPlus)
                context.fillStyle = "#000000"
                
                if(e[i].showOn==true && context.isPointInPath(pathPlus,mouse_clickX, mouse_clickY))
                e[i].showOn=false;
                else if(context.isPointInPath(pathPlus,mouse_clickX, mouse_clickY)){
                    e[i].showOn=true;
                  
                }
                                }


                
            const path = new Path2D()
            
                path.rect((section/2+(indexOnLevel[level]*(section)))-20, y-30, 10, 10)
                
                context.fillStyle = "#000000"
                context.fill(path)
                 
                //context.fill(path)
                context.stroke(path)
                context.fillStyle = "#000000"
                
                if(context.isPointInPath(path,mouse_clickX, mouse_clickY)||e[i].attrOn) {
                   

                    if(e[i].attrOn==true&& context.isPointInPath(path,mouse_clickX, mouse_clickY))
                    e[i].attrOn=false;
                    else if( e[i].nodeType != Node.TEXT_NODE && e[i].hasAttributes()){
                        
                        let msg=""
                        for (let index = 0; index < e[i].attributes.length; index++) {
                           
                            var attribut = e[i].attributes[index];
                            msg=attribut.name + " = " + attribut.value +"\n";
                            let yAttr=y+(-30*index);
                            context.rect((section/2+(indexOnLevel[level]*(section)))-100, yAttr, 50, 20);
                            context.fillText(msg,(section/2+(indexOnLevel[level]*(section)))-75, yAttr+12, 40);
                        }
                        context.stroke();
                        e[i].attrOn=true;
                       
                    }
                    
                  }

               
                  
            // }
            
           if(level !=0){
                context.beginPath();
                context.moveTo((section/2+(indexOnLevel[level]*(section))), y-30);
                context.lineTo(x, y-40);
               
                context.stroke();
            }
            
            
            
           if(e[i].attrOn==undefined)
                e[i].attrOn=false;

                if(e[i].showOn==undefined)
                e[i].showOn=false; 

                if(!(e[i].showOn))
          node(e[i].childNodes,(section/2+(indexOnLevel[level]*(section))),y+70,level+1,mouse_clickX,mouse_clickY);
          
          
       }
        
   

}

node(document.children,x,y,0)

document.addEventListener("click",  function (e) {
    e.stopPropagation()
    const XY = getXY(canvas, e)
    context.clearRect(0, 0, canvas.width, canvas.height);
    indexOnLevel=[];
    node(document.children,x,y,0, XY.x, XY.y)
    
  }, false)

  btn.onclick = function() {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.toDataURL("image/png");
    a.download = "canvas-image.png";
    a.click();
    document.body.removeChild(a);
}