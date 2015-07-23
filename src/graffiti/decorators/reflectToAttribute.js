import { decorate } from './utils';
import { metaFor } from '../private/utils';

function decorateDescriptor(target, attrName, { key, enumerable, initializer }) {
  target.hasInitialized = false;

  if (attrName === undefined) {
    attrName = key;
  }

  return {
    // Keep these the same from the original descriptor
    key, enumerable,

    get() {
      if (this.hasInitialized) {
        return this[key];
      } else {
        this.hasInitialized = true;
        return value = this[key] = initializer.call(this);
      }
    },

    set(newValue) {
      const meta = metaFor(this);

      this[key] = newValue;

      if (meta.isInitializing) {
        // Don't reflect the value during initialization
        // Otherwise it will blow any value the consumer set
        if (this.hasAttribute(attrName)) {
          return;
        }
      }


      meta.isCheckingAttributes = true;

      switch (this[key]) {
        case true:
          this.setAttribute(attrName, '');
          break;

        case false:
        case null:
        case undefined:
          this.removeAttribute(attrName);
          break;

        default:
          this.setAttribute(attrName, '' + this[key]);
      }

      meta.isCheckingAttributes = false;
    }
  };
}

export default function reflectToAttribute() {
  return decorate(decorateDescriptor, arguments);
}
