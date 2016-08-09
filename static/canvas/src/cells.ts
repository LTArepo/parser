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

export interface IconButton {
    label: string
    icon_path: string
    callback: () => any
}

export class IconButtons extends Cell {

    cssClasses = this.cssClasses + 'ce-three-icons '
    buttons: Array<IconButton>
    $buttons: any

    constructor(buttons: Array<IconButton>) {
        super()
        this.buttons = buttons
    }

    renderContents() {
        this.$buttons = this.buttons.map(function (b) {
            let html =
                `<div class="ce-icon-button-container">
			<img class="ce-icon-button-icon" src="${b.icon_path}">
			<div class="ce-icon-button-label">${b.label}</div>
		</div>`
            let $node = $(html)
            $node.click(b.callback)
            return $node
        })
        this.$elem.append(this.$buttons)
    }

    destroy() {
        super.destroy()
    }
}

export interface NumberInput {
    callback: (number) => any
    label: string
    step: number
    min: number
    max: number
}

export class NumberInputs extends Cell {

    cssClasses = this.cssClasses + 'ce-number-inputs '
    inputs: Array<NumberInput>
    $inputs: any

    constructor(inputs: Array<NumberInput>) {
        super()
        this.inputs = inputs
    }

    renderContents() {
        this.$inputs = this.inputs.map(function (b) {
            let html =
                `<div class="ce-number-input-container">
			<input type="number" value=0 class="ce-number-input" min="${b.min}" max="${b.max}" step="${b.step}">
			<div class="ce-number-input-label">${b.label}</div>
		</div>`
            let $node = $(html)
            $node.change(() => b.callback($node.find('input').val()))
            return $node
        })
        this.$elem.append(this.$inputs)
    }

    destroy() {
        super.destroy()
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
