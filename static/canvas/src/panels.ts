import { RenderableElement, InterfaceElement } from './screen'

class Panel extends InterfaceElement {

    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-panel '
}

class Window extends Panel {
    cssClasses = this.cssClasses + 'in-window '
    topbar: WindowTopbar

    render() {
        super.render()
        this.configureTopbar()
    }

    configureTopbar() {
        this.topbar = new WindowTopbar(this.$elem, this)
        this.topbar.render()
    }
}

/** panel inside a panel */
class Subpanel extends RenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-subpanel '
}

/** subpanel that contains Cell objects */
class MatrixSubpanel extends Subpanel {

    addCell(cell: Cell) {
    }
}

class Cell extends RenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-cell '
}

class Row extends Cell {
    cssClasses = this.cssClasses + 'in-row-cell '
}

class WindowTopbar extends Subpanel {
    cssClasses = this.cssClasses + 'in-window-topbar '
    windowObject: Window

    constructor($container: any, windowObject: Window) {
        super($container)
        this.windowObject = windowObject
    }

    render() {
        super.render()
        this.configureButtons()
    }

    configureButtons() {

    }

    configureDrag() {

    }

}

export { Panel, Window, Subpanel, Cell }
export { MatrixSubpanel }

