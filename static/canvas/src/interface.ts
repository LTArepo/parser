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

    constructor($container: any, x: number, y: number) {
        this.$container = $container
        this.x = x
        this.y = y
    }

    render() {
        this.$elem = $(this.elemHTML)
        this.$container.append(this.$elem)
        this.$elem.addClass(this.cssClasses)
    }

    destroy() {
        this.$elem.remove()
    }

}

class InterfaceElement extends RenderableElement {
    cssClasses = this.cssClasses + 'interface '
}

export { RenderableElement }
export { InterfaceElement }

