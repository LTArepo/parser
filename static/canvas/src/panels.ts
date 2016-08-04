import { RenderableElement, RootRenderableElement, ChildRenderableElement } from './screen'
import * as Cells from './cells'

declare var $: any

class Panel extends RootRenderableElement {

    subpanels: Array<Subpanel> = []

    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-panel '

    addSubpanel(subpanel) {
        subpanel.generate(this)
        this.subpanels.push(subpanel)
    }
}

class Window extends Panel {
    cssClasses = this.cssClasses + 'in-window '
    topbar: WindowTopbar

    render() {
        super.render()
        this.configureTopbar()
    }

    configureTopbar() {
        this.topbar = new WindowTopbar()
        this.topbar.generate(this)
    }
}

/** panel inside a panel */
class Subpanel extends ChildRenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-subpanel '

}

/** subpanel that contains Cell objects */
class MatrixSubpanel extends Subpanel {

    addCell(cell: Cells.Cell) {
        cell.generate(this)
    }
}

class WindowTopbar extends Subpanel {
    cssClasses = this.cssClasses + 'in-window-topbar '
    mouseDown: boolean = false
    mouseDownX: number
    mouseDownY: number
    parent: Window

    render($container) {
        super.render($container)
        this.configureButtons()
        this.configureDrag()
    }

    configureButtons() {

    }

    configureDrag() {
        var $body = $('body')

        this.$elem.mousedown($.proxy(function (e) {
            e.preventDefault()
            this.mouseDown = true
            this.mouseDownX = e.pageX - this.$elem.offset().left
            this.mouseDownY = e.pageY - this.$elem.offset().top
            $body.mousemove($.proxy(onMouseMove, this))
            this.$elem.mouseout($.proxy(onMouseOut, this))
        }, this))

        $body.mouseup($.proxy(function () {
            this.mouseDown = false
            $body.unbind('mousemove')
        }, this))

        function onMouseMove(e) {
            let x = e.pageX - this.mouseDownX
            let y = e.pageY - this.mouseDownY
            this.parent.$elem.css({ left: x, top: y })
        }

        function onMouseOut(e) {
            this.$elem.unbind('mousemove')
        }
    }

    destroy() {
        this.$elem.unbind('mouseup')
        this.$elem.unbind('mousedown')
        this.$elem.unbind('mousemove')
        this.$elem.remove()
    }

}

export { Panel, Window, Subpanel }
export { MatrixSubpanel }

