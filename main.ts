/// <reference path="UIRect.ts" />

var screenSize = new Vector(600,400)
var crret = createCanvas(screenSize.x,screenSize.y)
var canvas = crret.canvas
canvas.style.border = '1px solid black'
var ctxt = crret.ctxt
var screenRect = new Rect(new Vector(0,0), screenSize)





var rect = new UIRect(
    new Rect(new Vector(0,0), new Vector(0.5,0.5)),
    new Rect(new Vector(-25,-25), new Vector(50,50)),
    screenRect
)


loop((dt) => {
    ctxt.clearRect(0,0,screenSize.x,screenSize.y)
    rect.readHandles()
    rect.draw(ctxt)
})

