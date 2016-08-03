import { ChildRenderableElement } from './screen.ts'

export class Cell extends ChildRenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'in-cell '

    render($container) {
        super.render($container)
        this.renderContents()
    }

    renderContents() { }
}

export class Row extends Cell {
    cssClasses = this.cssClasses + 'in-row-cell '
}

export class Label extends Cell {
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

