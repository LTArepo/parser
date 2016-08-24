import { GUInterface } from './interface'

declare var $: any

interface Refreshable {
    refresh(): void
}

/** Base class for every programatically renderable element */
class RenderableElement {
    elemHTML: string = ''
    cssClasses: string = ''
    $container: any
    $elem: any
    options: any
    render_id: string

    constructor(options = {}) {
        this.options = options
        this.initialConfig()
    }

    addID(id: string) {
        this.render_id = id
        this.$elem.data('render-id', this.render_id)
    }

    initialConfig() {
        if (this.options.cssClasses) this.cssClasses += this.options.cssClasses
        if (this.options.closeOnClickOut) this.cssClasses += 'close-on-click-out '
        if (this.options.slideUpOnClickOut) this.cssClasses += 'slide-up-on-click-out '
    }

    setContainer($container) {
        this.$container = $container
    }

    refresh() { }

    destroy() { }

}

/** RenderableElements that are directly appended to the body or main container 
    Render method is called directly, once instantiated.
*/
class RootRenderableElement extends RenderableElement {
    GUI: GUInterface
    x: number
    y: number

    constructor($container: any, GUI: GUInterface, x: number = 0, y: number = 0, options = {}) {
        super(options)
        this.GUI = GUI
        this.$container = $container
        this.x = x
        this.y = y
    }

    render() {
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
        this.$elem.css({ left: this.x, top: this.y })
        this.GUI.addElement(this)
    }

    destroy() {
        this.$elem.remove()
        this.GUI.removeElement(this)
    }

}

/** RenderableElement that has a parent RenderableElement 
    Render method is called from the parent add<Element> method
*/
class ChildRenderableElement extends RenderableElement {
    parent: RenderableElement
    generated: boolean = false

    /** Sets the element parent as well as getting appended and rendered. */
    generate(parent: RenderableElement) {
        this.parent = parent
        this.render(parent.$elem)
        this.generated = true
    }

    render($container) {
        this.$container = $container
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
    }

    addFragment(frag) {
        this.$elem.append(frag)
    }

    destroy() {
        this.$elem.remove()
    }

}

export { RenderableElement, ChildRenderableElement, RootRenderableElement }

