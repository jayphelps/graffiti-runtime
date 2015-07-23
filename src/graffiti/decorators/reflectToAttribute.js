import { decorate } from './utils';
import { metaFor } from '../private/utils';

function metaForDescriptor(context, key) {
  const { descriptors } = metaFor(context);
  let descMeta = descriptors[key];
  if (!descMeta) {
    descMeta = descriptors[key] = { hasRunInitializer: false, value: undefined };
  }

  return descMeta;
}

function decorateDescriptor(target, key, { enumerable, initializer }, [attrName] = []) {
  if (attrName === undefined) {
    attrName = key;
  }

  return {
    // Keep these the same from the original descriptor
    key, enumerable,

    get() {
      const descMeta = metaForDescriptor(this, key);

      if (descMeta.hasRunInitializer) {
        return descMeta.value;
      } else {
        const ret = descMeta.value = initializer.call(this);
        descMeta.hasRunInitializer = true;
        return ret;
      }
    },

    set(newValue) {
      const meta = metaFor(this);
      const descMeta = metaForDescriptor(this, key);

      descMeta.value = newValue;

      if (meta.isInitializing) {
        // Don't reflect the value during class instance initialization
        // otherwise it will blow away any value the consumer set
        if (this.hasAttribute(attrName)) {
          return;
        }
      }

      meta.isCheckingAttributes = true;

      switch (newValue) {
        case true:
          this.setAttribute(attrName, '');
          break;

        case false:
        case null:
        case undefined:
          this.removeAttribute(attrName);
          break;

        default:
          this.setAttribute(attrName, '' + newValue);
      }

      meta.isCheckingAttributes = false;
    }
  };
}

export default function reflectToAttribute(...args) {
  return decorate(decorateDescriptor, args);
}
