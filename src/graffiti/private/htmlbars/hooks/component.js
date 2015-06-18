import { metaFor } from '../../utils';
import { render } from 'htmlbars-runtime';

export default function componentHook(renderNode, env, scope, tagName, params, attrs, templates, visitor) {
  const renderOptions = {};
  const { contextualElement } = renderNode;

  let element;
  if (contextualElement === scope.self) {
    element = contextualElement;
    renderOptions.renderNode = renderNode;
  } else {
    element = env.dom.createElement(tagName);
    renderNode.setNode(element);
  }

  const meta = metaFor(element);
  meta.isCheckingAttributes = true;

  for (const name in attrs) {
    const value = env.hooks.getValue(attrs[name]);
    if (element.getAttribute(name) !== value) {
      element.setAttribute(name, value);
    }
  }

  meta.isCheckingAttributes = false;

  if (renderNode.lastResult) {
    renderNode.lastResult.rerender();
  } else {
    const fragment = render(templates.default, env, scope, renderOptions).fragment;
    element.appendChild(fragment);
  }
}
