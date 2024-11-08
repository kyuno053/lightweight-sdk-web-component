import { AbstractComponent } from "./abstractComponent";
import { ComponentParams, CUSTOM_COMPONENT_CONFIG } from "./component.type";
import { findRefElement, parseModuleToHtml } from "./dom.tools";

// Declare a unique key to store the flag on the prototype.
// This symbol is used to uniquely identify and access the DOM link flag,
// ensuring there are no conflicts with other properties on the prototype.
export const REQUEST_DOM_LINK_KEY = Symbol("requestDomLink");

interface ConstructorFunction<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new(...args: any[]): T
}

/** 
 * Define a custom web component using a decorator.
 * The decorator configures the component's template, styles, and any additional 
 * properties, as well as handling Shadow DOM attachment if specified.
 * @param p @see {@link ComponentParams}
 * @returns a constructor factory
 */
export function CustomComponent<T extends ConstructorFunction<AbstractComponent>>(p: ComponentParams): (constructor: T) => void {
    return (constructor: T): void => {

        // Create a template element to contain the component's HTML structure, parsed for use.
        const templateElement = document.createElement('template');
        templateElement.innerHTML = parseModuleToHtml(p.template);

        // Attach component configuration as a non-writable property on the prototype
        Object.defineProperty(constructor.prototype, CUSTOM_COMPONENT_CONFIG, {
            value: p
        });

        // Save the original connectedCallback, if it exists, to allow for extension.
        const originalConnectedCallback = constructor.prototype.connectedCallback;

        // Define a custom connectedCallback for the component
        constructor.prototype.connectedCallback = function (this: AbstractComponent) {

            // If Shadow DOM is specified, attach it and add the template to it
            if (p.attachToShadow) {
                // Determine Shadow DOM mode, defaulting to 'open' if boolean true is given.
                const mode: ShadowRootMode = typeof p.attachToShadow === "boolean" ? "open" : p.attachToShadow;

                // Attach a Shadow DOM if not already attached
                if (!this.shadowRoot) {
                    this.attachShadow({ mode });
                }

                // Append the template content to the Shadow DOM
                if (this.shadowRoot) {
                    this.shadowRoot.appendChild(templateElement.content.cloneNode(true));
                }
            } else {
                // If not using Shadow DOM, insert template content directly into Light DOM
                this.innerHTML = "";
                this.appendChild(templateElement.content.cloneNode(true));
            }

            // Apply any specified CSS classes to the component root element
            this.classList.add(...p.cssClasses);

            // Process and link properties specified in __linkedProperties to their DOM elements
            for (const requested of this.__linkedProperties ?? []) {
                const elt = findRefElement(requested.ref);
                if (elt == null) {
                    throw new Error(`ref ${requested.ref} not found`);
                }
                // Attach the found element as a property on the component instance
                Object.defineProperty(this, requested.property, { value: elt });
            }

            // Call the original connectedCallback if it exists
            if (originalConnectedCallback) {
                originalConnectedCallback.call(this);
            }

        };

        // Register the custom element with the specified tag name
        window.customElements.define(p.tagName, constructor);
    };
}


/**
 * Decorator that flags the class member as a link to a dom element
 * @param ref
 */
export function LinkToDom(ref: string) {
    return function <T extends AbstractComponent>(target: T, key: string | symbol): void {
        // Si target est indéfini, renvoyer un avertissement
        if (!target) {
            throw new Error(`LinkToDom: 'target' is undefined for property ${String(key)}`);
        }

        // Ajouter un flag `request` pour marquer cette propriété comme liée au DOM
        if (!target.__linkedProperties) {
            target.__linkedProperties = [];
        }

        // Ajouter la propriété à la liste des propriétés liées
        target.__linkedProperties.push({
            property: String(key),
            ref
        });
    }
}