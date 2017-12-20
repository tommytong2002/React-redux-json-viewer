import Parser from '../../parser/objectParser';
import PathFinder from '../../parser/pathFinder';

export function parseJson(array, headers) {
  return Parser.getInstance(array, headers).buildAbstractTree();
}


export function checkJsonValidity(json) {
  try {
    JSON.parse(json);
    return {
      error: false,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      errorMessage: error.message
    };
  }
}

export function populateWithPath(tree) {
  return tree.map((node) => {
    node.meta.path = PathFinder.trace(tree, node.meta.id);
    return node;
  });
}

export function closeTypeObject(node) {
  if (node.meta.type === 'Object' || node.meta.type === 'Array') {
    node.meta.isExpanded = false;
  }
}

export function toJsonString(json, width) {
  const stringify = JSON.stringify(
    JSON.parse(json),
    null,
    width
  );
  console.log(stringify);
  return stringify;
}

export function marginate(node, margin, childof, id) {
  node.meta.mleft = margin + 20;
  console.log(childof);
  node.meta.isChildof.push(id, ...childof);
  return node;
}

export function tagNodeAsCompleted(node, subtree) {
  node.meta.isExpanded = true;
  node.meta.payload = subtree;
  node.meta.payloadIsParsed = true;
}

export const saveJsonToLocalStorage = (state) => {
  if ('localStorage' in window && typeof state === 'string') {
    localStorage.setItem('json', state || JSON.stringify(
      { data: { empty: true } }, null, 2));
    return state;
  }
  alert('local storage not supported by your current Browser');
  return state;
};


export default function processJsonToViewable(value, meta = false) {
  return populateWithPath(parseJson(value, meta));
}
