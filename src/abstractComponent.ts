import { ComponentParams, CUSTOM_COMPONENT_CONFIG, LinkedProperty } from "./component.type";

/** Basic class used to declare web components */
export class AbstractComponent extends HTMLElement {

    /** List of all the class members linked to a dom element */
    public __linkedProperties?: LinkedProperty[]
    /** All the component's params */
    public [CUSTOM_COMPONENT_CONFIG]?: ComponentParams;

    public connectedCallback(): void {
        this.init();
        this.refresh();
    }

    public disconnectedCallback(): void { }

    /** 
     * Function called in the component's life cycle
     * Used to init the DOM and the sub components
     */
    public init(): void { }

    /**
     * Function called in the component's life cycle
     * Used to refresh the datas, and re render the component
     * Please be conscious that if you clean THIS as a dom element, the template won't be re rendered again
     */
    public refresh(): void { }
}