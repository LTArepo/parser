import { RenderableElement, RootRenderableElement, ChildRenderableElement } from './screen'
import * as Cells from './cells'


declare var $: any

class Panel extends RootRenderableElement {

    subpanels: Array<Subpanel> = []

    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-interface in-panel '

    addSubpanel(subpanel) {
        subpanel.generate(this)
        this.subpanels.push(subpanel)
    }

    refresh() {

    }
}

class Window extends Panel {
    cssClasses = this.cssClasses + 'in-interface in-window '
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
    cssClasses = this.cssClasses + 'in-matrix-subpanel '
    cells: Array<Cells.Cell> = []

    addCell(cell: Cells.Cell) {
        cell.generate(this)
        this.cells.push(cell)
    }

    destroy() {
        super.destroy()
        this.clean()
    }

    clean() {
        this.cells.forEach(x => x.destroy())
        this.cells = []
    }
}

interface Tab {
    icon_path: string
    tabGenerator: (subanel: MatrixSubpanel) => void
}

class TabRow extends Subpanel {
    cssClasses = this.cssClasses + 'in-tabrow-subpanel clearfix '
    tabs: Array<Tab>
    $tabs: any

    constructor(tabs = []) {
        super()
        this.tabs = tabs
    }

    generate(parent) {
        super.generate(parent)
        this.renderTabs()
    }

    renderTabs() {
        var parent = <TabbedMatrixSubpanel>this.parent
        this.$tabs = this.tabs.map(function (t) {
            let html =
                `<div class='in-tabrow-tab'>
			<img class='in-tabrow-tab-icon' src='${t.icon_path}'>
		</div>`
            let $node = $(html)
            $node.click(() => parent.loadTab(t.tabGenerator))
            return $node
        })
        this.$elem.append(this.$tabs)
    }

    refreshTabs() {
        this.$elem.empty()
        this.renderTabs()
    }

    addTab(tab: Tab) {
        this.tabs.push(tab)
        this.refreshTabs()
    }
}

class TabbedMatrixSubpanel extends Subpanel {

    cssClasses = this.cssClasses + 'in-tabbed-subpanel '
    contentSubpanel: MatrixSubpanel
    tabRow: TabRow

    /** The element must be generated before loading tabs */
    loadTab(tabGenerator: (subpanel: MatrixSubpanel, options) => void, options = {}) {
        if (this.generated) {
            this.contentSubpanel.clean()
            tabGenerator(this.contentSubpanel, options)
        }
    }

    addTab(tab: Tab) {
        this.tabRow.addTab(tab)
    }

    generate(parent) {
        super.generate(parent)
        this.tabRow = new TabRow()
        this.tabRow.generate(this)
        this.contentSubpanel = new MatrixSubpanel()
        this.contentSubpanel.generate(this)
    }

    destroy() {
        super.destroy()
        this.contentSubpanel.destroy()
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
            let offset = this.$elem.offset()
            this.parent.x = offset.left
            this.parent.y = offset.top
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
        //@TODO: remove body mouseup listener
        this.$elem.unbind('mouseup')
        this.$elem.unbind('mousedown')
        this.$elem.unbind('mousemove')
        this.$elem.remove()
    }

}

export { Panel, Window, Subpanel }
export { MatrixSubpanel, TabbedMatrixSubpanel }

