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
    x: number
    y: number

    constructor($container: any, x: number = 0, y: number = 0) {
        this.$container = $container
        this.x = x
        this.y = y
        //this.render()
    }

    render() {
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
    }

    setContainer($container) {
        this.$container = $container
    }

    destroy() {
        this.$elem.remove()
    }

}

class InterfaceElement extends RenderableElement {
    cssClasses = this.cssClasses + 'in-interface '
}


export { RenderableElement, InterfaceElement }

