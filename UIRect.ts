/// <reference path="node_modules/rect2x/rect.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />


class UIRect{

    handles:Handle[]

    //get in relative coordinates
    //data is saved relatively
    //transform rel to abs coordinates for handles
    //transform abs to rel coordinates for drawing

    constructor(public anchorRect:Rect, public offsetRect:Rect, public parent:Rect){

        var absAnchor = this.anchorRel2Abs()
        var absOffset = this.offsetRel2Abs()
        this.handles = [
            new Handle(absAnchor[0]),
            new Handle(absAnchor[1]),
            new Handle(absOffset[0]),
            new Handle(absOffset[1]),
        ]
    }

    readHandles(){
        
        var anchorRect = this.anchorAbs2Rel(this.handles[0].pos.get(),this.handles[1].pos.get())
        var offsetRect = this.offsetAbs2Rel(this.handles[2].pos.get(),this.handles[3].pos.get())

        this.anchorRect = anchorRect
        this.offsetRect = offsetRect
    }

    //for reading data from anchor handles into this datastructure
    anchorAbs2Rel(absAnchorA:Vector,absAnchorB:Vector):Rect{
        absAnchorA.c().sub(this.parent.pos).div(this.parent.size)
        absAnchorB.c().sub(this.parent.pos).div(this.parent.size)
        return new Rect(absAnchorA,absAnchorA.to(absAnchorB))
    }

    //for writing this datastructure to the handles
    anchorRel2Abs():[Vector,Vector]{
        return [
            this.parent.getPoint(this.anchorRect.getPoint(new Vector(-1,-1))),
            this.parent.getPoint(this.anchorRect.getPoint(new Vector( 1, 1))),
        ]
    }

    //for reading data from offset handles into this datastructure
    offsetAbs2Rel(absOffsetA:Vector,absOffsetB:Vector):Rect{
        var absAnchors = this.anchorRel2Abs()
        var absAnchorA = absAnchors[0]
        var absAnchorB = absAnchors[1]

        var posmin = absAnchorA.to(absOffsetA)
        var posmax = absAnchorB.to(absOffsetB)
        return new Rect(posmin,posmin.to(posmax))
    }

    //for writing this datastructure to the handles
    offsetRel2Abs():[Vector,Vector]{
        var absAnchors = this.anchorRel2Abs()
        return [
            absAnchors[0].add(this.offsetRect.pos),
            absAnchors[1].add(this.offsetRect.getPoint(new Vector(1,1))),
        ]
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.handles.forEach(h => h.draw(ctxt))
        var rectTuple = this.offsetRel2Abs()
        var rect = new Rect(rectTuple[0],rectTuple[0].to(rectTuple[1]))
        rect.draw(ctxt)
    }
}

class Handle{
    selected:boolean = false;
    pos:Box<Vector>

    constructor(pos:Vector){
        this.pos = new Box(pos)

        document.addEventListener('mousedown',e => {
            var mousepos = getMousePos(canvas,e)
            
            if(this.pos.get().to(mousepos).length() < 10){
                this.selected = true
            }
        })

        document.addEventListener('mouseup', e => {
            this.selected = false
        })

        document.addEventListener('mousemove', e => {
            var mousepos = getMousePos(canvas,e)
            if(this.selected){
                this.pos.set(mousepos)
            }
        })
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.pos.get().draw(ctxt)
    }
}