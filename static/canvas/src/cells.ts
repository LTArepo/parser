import { ChildRenderableElement } from './screen.ts'

declare var $: any

export class Cell extends ChildRenderableElement {
    elemHTML = '<div></div>'
    cssClasses = this.cssClasses + 'ce-cell '

    render($container) {
        super.render($container)
        this.renderContents()
    }

    renderContents() { }
}

export class Row extends Cell {
    cssClasses = this.cssClasses + 'ce-row '
}

export class Label extends Cell {
    cssClasses = this.cssClasses + 'ce-label '
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

export class TextInput extends Cell {
    cssClasses = this.cssClasses + 'ce-textInput '
    placeholder: string
    callback: (val: string) => any
    $input: any

    constructor(callback, placeholder = undefined) {
        super()
        this.placeholder = placeholder
        this.callback = callback
    }

    renderContents() {
        this.$input = $('<input type="text" placeholder="' + this.placeholder + '">')
        this.$elem.append(this.$input)
        onEnter(this.$input, this.callback)
    }

    destroy() {
        super.destroy()
        this.$input.unbind('keyup')
    }

}

export class Select extends Cell {
    cssClasses = this.cssClasses + 'ce-select '
    callback: (val: string) => any
    options: Array<string> = []
    $select: any

    constructor(callback, options) {
        super()
        this.callback = callback
        this.options = options
    }

    renderContents() {
        this.$select = $('<select>')
        this.$select.append(this.options.map(x => '<option>' + x + '</option>'))
        this.$elem.append(this.$select)
        onChange(this.$select, this.callback)
    }

    destroy() {
        super.destroy()
        this.$select.unbind('change')
    }

}



// ==================================================
//			UTILITIES
// ==================================================

function onEnter($elem, callback) {
    $elem.keyup(function (e) {
        if (e.keyCode == 13) {
            callback($elem.val())
        }
    })
}

function onChange($elem, callback) {
    $elem.change(function (e) {
        callback($elem.val())
    })
}
