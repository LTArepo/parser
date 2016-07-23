interface Refreshable {
    refresh(): void
}

class RenderableElement {
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
        //this.$container.append(this.$elem)
        //this.$elem.addClass(this.cssClasses)
        console.log(this.cssClasses)
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

