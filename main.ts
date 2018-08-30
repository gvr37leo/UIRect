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
var screenRectHandles = [
    new Handle(new Vector(0,0)),
    new Handle(screenSize.c()),
]

function updateParent(v:Vector){
    var newrect = rectFromAbsPos(screenRectHandles[0].pos.get(),screenRectHandles[1].pos.get())
    rect.parent.set(newrect)
}

screenRectHandles[0].pos.onchange.listen(updateParent)
screenRectHandles[1].pos.onchange.listen(updateParent)

var rect = new UIRect(
    new Vector(0, 0.5), new Vector(1, 0.5),
    new Vector(100,-50), new Vector(-100,50),
    new Box(screenRect)
)


loop((dt) => {
    ctxt.clearRect(0,0,screenSize.x,screenSize.y)

    screenRectHandles.forEach(h => h.draw(ctxt))
    rect.draw(ctxt)
})

function rectFromAbsPos(a:Vector, b:Vector){
    return new Rect(a.c(), a.to(b))
}
