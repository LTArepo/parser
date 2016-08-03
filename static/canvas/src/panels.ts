import { RenderableElement, RootRenderableElement, ChildRenderableElement } from './screen'
import * as Cells from './cells'

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

export { Panel, Window, Subpanel }
export { MatrixSubpanel }

