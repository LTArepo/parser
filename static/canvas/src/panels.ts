import { RenderableElement, RootRenderableElement, ChildRenderableElement } from './screen'

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

    addCell(cell: Cell) {
        cell.generate(this)
    }
}

class WindowTopbar extends Subpanel {
    cssClasses = this.cssClasses + 'in-window-topbar '
    parent: Window

    render($container) {
        super.render($container)
        this.configureButtons()
    }

    configureButtons() {

    }

    configureDrag() {

    }

}

// ==================================================
//		    MATRIX CELLS
// ==================================================

class Cell extends ChildRenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-cell '

    render($container) {
        super.render($container)
        this.renderContents()
    }

    renderContents() { }
}

class Row extends Cell {
    cssClasses = this.cssClasses + 'in-row-cell '
}

class LabelCell extends Cell {
    text: string = ''

    constructor(text: string) {
        super()
        this.text = text
    }

    renderContents() {
        let label = '<div class="cell-label">' + this.text + '</div>'
        this.$elem.append(label)
    }
}

export { Panel, Window, Subpanel, Cell }
export { MatrixSubpanel }

