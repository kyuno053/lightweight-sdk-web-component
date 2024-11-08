
/** The attriute used to bind dom to component's members */
const REF_ATTRIBUTE = "ref"

/**
 * Find an element with the attribute ref= in the given parent (or the entire body)
 * @param ref the ref attribute's value of the target dom element
 * @param parent the container used to search the element. document.body by default
 * @returns the founded html element or undefined
 */
export function findRefElement(ref: string, parent?: HTMLElement): HTMLElement | undefined {
    const parentElement = parent ?? document.body;
    const elt = parentElement.querySelector(`[${REF_ATTRIBUTE}=${ref}]`);

    return elt == null ? undefined : elt as HTMLElement
}

/** 
 * Parse the value of ComponentParams.template into a string if it was fetched with required function
 * @param mod the template value 
 * @returns the template as a string
 */
export function parseModuleToHtml(mod: any): string {
    return "default" in mod ? mod.default as string : "";
}