
export const CUSTOM_COMPONENT_CONFIG = "__customComponentConfig"

/** Abstract component params*/
export interface ComponentParams {
    /**
     *  A tag name that will be used to register the component as a custom element
     *  Should always follow the following format "my-name"
     *  ex: "custom-menu-component"
     */
    tagName: string;
    /** HTML Template */
    template?: string;
    /** Specific style of the component */
    style?: string;
    /** Css classes to append */
    cssClasses?: string[];
    /** Define if the component should be atatched to the shadow dom */
    attachToShadow?: boolean | ShadowRootMode
}

/** Map a property key to a html element by it's ref attribute */
export interface LinkedProperty {
    /** The ref attribute value */
    ref: string;
    /** The object's property */
    property: string;
}