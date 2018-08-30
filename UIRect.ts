/// <reference path="node_modules/rect2x/rect.ts" />
/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />


class UIRect{

    handles:Handle[]
    readonly absRect:Box<Rect>

    constructor(public anchormin:Vector,public anchormax:Vector, public offsetmin:Vector, public offsetmax:Vector, public parent:Box<Rect>){

        this.absRect = new Box(this.getAbsRect())
        var absAnchor = this.anchorRel2Abs()
        var absOffset = this.offsetRel2Abs()
        this.handles = [
            new Handle(absAnchor[0]),
            new Handle(absAnchor[1]),
            new Handle(absOffset[0]),
            new Handle(absOffset[1]),
        ]

        parent.onchange.listen(r => {
            var newhandles = this.rel2Abs()
            this.handles[0].pos.set(newhandles[0])
            this.handles[1].pos.set(newhandles[1])
            this.handles[2].pos.set(newhandles[2])
            this.handles[3].pos.set(newhandles[3])
        })

        this.handles.forEach(h => h.pos.onchange.listen(this.readHandles))
    }

    readHandles = () => {
        var res = this.abs2Rel(
            this.handles[0].pos.get(),
            this.handles[1].pos.get(),
            this.handles[2].pos.get(),
            this.handles[3].pos.get(),
        )

        this.anchormin = res[0]
        this.anchormax = res[1]
        this.offsetmin = res[2]
        this.offsetmax = res[3]

        this.absRect.set(this.getAbsRect())
    }

    getAbsRect():Rect{
        var res = this.offsetRel2Abs()
        return new Rect(res[0],res[0].to(res[1]))
    }

    //for reading data from anchor handles into this datastructure
    anchorAbs2Rel(absAnchorA:Vector,absAnchorB:Vector):[Vector,Vector]{
        var a = absAnchorA.c().sub(this.parent.get().pos).div(this.parent.get().size)
        var b = absAnchorB.c().sub(this.parent.get().pos).div(this.parent.get().size)
        return [a,b]
    }

    //for writing this datastructure to the handles
    anchorRel2Abs():[Vector,Vector]{
        return [
            this.parent.get().getPoint01(this.anchormin),
            this.parent.get().getPoint01(this.anchormax),
        ]
    }

    //for reading data from offset handles into this datastructure
    offsetAbs2Rel(absOffsetA:Vector,absOffsetB:Vector):[Vector,Vector]{
        var absAnchors = this.anchorRel2Abs()
        var absAnchorA = absAnchors[0]
        var absAnchorB = absAnchors[1]

        var posmin = absAnchorA.to(absOffsetA)
        var posmax = absAnchorB.to(absOffsetB)
        return [posmin,posmax]
    }

    //for writing this datastructure to the handles
    offsetRel2Abs():[Vector,Vector]{
        var absAnchors = this.anchorRel2Abs()
        return [
            absAnchors[0].c().add(this.offsetmin),
            absAnchors[1].c().add(this.offsetmax),
        ]
    }

    abs2Rel(absAnchorA:Vector,absAnchorB:Vector,absOffsetA:Vector,absOffsetB:Vector):[Vector,Vector,Vector,Vector]{
 
        var anchorsrel = this.anchorAbs2Rel(absAnchorA,absAnchorB)

        var posmin = absAnchorA.to(absOffsetA)
        var posmax = absAnchorB.to(absOffsetB)
        return [anchorsrel[0], anchorsrel[1], posmin, posmax]
    }

    rel2Abs():[Vector,Vector,Vector,Vector]{
        var absAnchors = this.anchorRel2Abs()
        return [
            absAnchors[0],
            absAnchors[1],
            absAnchors[0].c().add(this.offsetmin),
            absAnchors[1].c().add(this.offsetmax),
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