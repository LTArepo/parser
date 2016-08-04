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

    constructor() { }

    setContainer($container) {
        this.$container = $container
    }

    destroy() { }

}

/** RenderableElements that are directly appended to the body or main container 
    Render method is called directly, once instantiated.
*/
class RootRenderableElement extends RenderableElement {
    x: number
    y: number

    constructor($container: any, x: number = 0, y: number = 0) {
        super()
        this.$container = $container
        this.x = x
        this.y = y
        //this.render()
    }

    render() {
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
        this.$elem.css({ left: this.x, top: this.y })
    }

    destroy() {
        this.$elem.remove()
    }

}

/** RenderableElement that has a parent RenderableElement 
    Render method is called from the parent add<Element> method
*/
class ChildRenderableElement extends RenderableElement {
    parent: RenderableElement

    /** Sets the element parent as well as getting appended and rendered. */
    generate(parent: RenderableElement) {
        this.parent = parent
        this.render(parent.$elem)
    }

    render($container) {
        this.$container = $container
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
    }

}

export { RenderableElement, ChildRenderableElement, RootRenderableElement }

