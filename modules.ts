class RenderableElement {
    container: any
    x: number
    y: number

    constructor(container: any, x: number, y: number) {
        this.x = x
        this.y = y
    }

    debug() {
        console.log(this.x)
        console.log(this.y)
        console.log(this.container)
    }

}

class InterfaceElement {

}

export { RenderableElement }
export { InterfaceElement }
