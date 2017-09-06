import { Image, Dimensions } from 'react-native';
import EventEmitter from 'EventEmitter';

/*
  I took this from @IDE BubbleBounce
  https://github.com/ide/bubblebounce/blob/master/src/FakeBrowser.js
*/

if (typeof global !== 'undefined' && global.window) {
    global.document = global.window.document;
    global.navigator = global.window.navigator;
}


class DOMNode {
    constructor(nodeName) {
        this.nodeName = nodeName;
    }

    get ownerDocument() {
        return window.document;
    }

    appendChild(element) {
        // unimplemented
    }
}

class DOMElement extends DOMNode {
    style = {};
    emitter = new EventEmitter();

    constructor(tagName) {
        super(tagName.toUpperCase());
    }

    insertBefore = () => {

    }

    getContext(contextType) {
        // if (global.canvasContext) {
        //   return global.canvasContext;
        // }
        return {
            fillRect: (_ => { }),
            drawImage: (_ => { }),
            getImageData: (_ => { }),
            getContextAttributes: (_ => ({
                stencil: true
            })),
            getExtension: (_ => ({
                loseContext: (_ => {

                })
            })),
        }
    }

    get tagName() {
        return this.nodeName;
    }
    addEventListener(eventName, listener) {
        console.log("add listener", this.tagName, eventName, listener);
        this.emitter.addListener(eventName, listener)
    }
    removeEventListener(eventName, listener) {
        this.emitter.removeListener(eventName, listener)
    }
}

class DOMDocument extends DOMElement {
    body = new DOMElement('BODY');

    constructor() {
        super('#document');
    }

    createElement(tagName) {
        return new DOMElement(tagName);
    }

    getElementById(id) {
        return new DOMElement('div');
    }
}

process.browser = true
window.emitter = new EventEmitter();
window.addEventListener = (eventName, listener) => {

    console.log("add listener", "WINDOW", eventName, listener);
    window.emitter.addListener(eventName, listener)
}
window.removeEventListener = (eventName, listener) => {
    // unimplemented
    window.emitter.removeListener(eventName, listener)
}

let { width, height } = Dimensions.get('window');
window.innerWidth = window.clientWidth = width;
window.innerHeight = window.clientHeight = height;
window.document = new DOMDocument();
window.location = "file://"; // <- Not sure about this... or anything for that matter ¯\_(ツ)_/¯
navigator.userAgent = "iPhone"; // <- This could be made better, but I'm not sure if it'll matter for PIXI


// Screen
window.screen = window.screen || {};
Object.defineProperty(window.screen, 'width', {
    get: function () { return Dimensions.get('window').width; },
    set: function (newValue) { },
    enumerable: true,
    configurable: true
});
Object.defineProperty(window.screen, 'height', {
    get: function () { return Dimensions.get('window').height; },
    set: function (newValue) { },
    enumerable: true,
    configurable: true
});
window.orientation = -90;
Dimensions.addEventListener("change", ({window: {width, height}}) => window.orientation = width > height ? -90 : 0 );
window.devicePixelRatio = 1;

global.performance = null; 