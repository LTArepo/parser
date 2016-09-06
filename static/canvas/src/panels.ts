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
    topbarTitle = ''
    topbar: WindowTopbar

    render() {
        super.render()
        this.configureTopbar()
    }

    configureTopbar() {
        this.topbar = new WindowTopbar()
        this.topbar.generate(this)
    }

    setTitle(title: string) {
        this.topbarTitle = title
    }

    minimize() {

    }
}

/** panel inside a panel */
class Subpanel extends ChildRenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-subpanel '

}

/** subpanel that contains Cell objects in a matrix structure */
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

interface TabData {
    icon_path: string
    tabGenerator: (subanel: MatrixSubpanel) => void
    options: any
}

class TabRow extends Subpanel {
    cssClasses = this.cssClasses + 'in-tabrow-subpanel clearfix '
    tabs: Array<TabData>
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
        this.$tabs = this.tabs.map($.proxy(function (t) {
            let html =
                `<div class='in-tabrow-tab'>
			<img class='in-tabrow-tab-icon' src='${t.icon_path}'>
		</div>`
            let $node = $(html)
            $node.click($.proxy(function () {
                this.$elem.find('.in-tabrow-tab').removeClass('active')
                $node.addClass('active')
                parent.loadTab(t.tabGenerator, t.options)
            }, this))
            return $node
        }, this))
        this.$elem.append(this.$tabs)
    }

    refreshTabs() {
        this.$elem.empty()
        this.renderTabs()
    }

    addTab(tab: TabData) {
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

    addTab(tab: TabData) {
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
        this.renderContents()
        this.configureDrag()
        this.addListeners()
    }

    renderContents() {
        this.$elem.append('<img src="/static/canvas/img/icons-node/drag-icon.png">')
        this.$elem.append('<div class="window-topbar-title text-uppercase">' + this.parent.topbarTitle + '</div>')
        this.$elem.append('<img class="window-topbar-maximize-minimize" src="/static/canvas/img/icons-node/maximize-minimize-icon.png">')

    }

    addListeners() {
        this.$elem.dblclick(() => this.parent.minimize())
    }

    configureDrag() {
        var $body = $('body')

        this.$elem.mousedown($.proxy(function (e) {
            e.preventDefault()
            this.mouseDown = true
            let viewportOffset = this.$elem.get(0).getBoundingClientRect();
            this.mouseDownX = e.pageX - viewportOffset.left
            this.mouseDownY = e.pageY - viewportOffset.top
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

