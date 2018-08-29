/// <reference path="UIRect.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />


var screenSize = new Vector(600,400)
var crret = createCanvas(screenSize.x,screenSize.y)
var canvas = crret.canvas
canvas.style.border = '1px solid black'
var ctxt = crret.ctxt
var screenRect = new Rect(new Vector(0,0), screenSize)

//de events methode van parent naar child
//-------
//aanpassingen aan de parent Rect wordt naar geluisterd door het UIRect kind
//deze updaten hun eigen handles
//aanpassingen aan de eigen handles wordt naar geluisterd door ditzelfde UIRect
//en dit update de rects anchors en offsets
//draw methode rekent de absolute rectangle uit met offsetRel2Abs



var rect = new UIRect(
    new Rect(new Vector(0,0), new Vector(0.5,0.5)),
    new Rect(new Vector(-25,-25), new Vector(50,50)),
    new Box(screenRect)
)


loop((dt) => {
    ctxt.clearRect(0,0,screenSize.x,screenSize.y)
    rect.draw(ctxt)
})

