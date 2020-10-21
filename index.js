const mergeLeft = require('ramda/src/mergeLeft')

// assume a set of numbers is all that's required

function defaultCompare(item1, item2) { return item1-item2 }

function isEmpty(set) { return !set }

function left(node) { return node ? node.left : null }
function right(node) { return node ? node.right : null }

function setLeft(node, child) { return node ? mergeLeft({ left: child }, node) : node }
function setRight(node, child) { return node ? mergeLeft({ right: child }, node) : node }

function linkLeft(params) {
  // t, l, right(l) := right(t), t, t

  // l->right = t;  /* link left */
  // l = t;
  // t = t->right;

  const [set, leftLast, rightFirst] = params

  setRight(leftLast, set)

  return [right(set), set, rightFirst]
}

function rotateLeft(set) {
  // t, right(t), left(right(t)) := right(t), left(right(t)), t

  // y = t->right;  /* rotate left */
  // t->right = y->left;
  // y->left = t;
  // t = y;
  // if (t->right == NULL) break;

  //             l
  //           ╱   ╲
  //         ╱       ╲
  //       f           r
  //     ╱   ╲       ╱   ╲
  //   c       i   o       u
  //
  //              ⇓
  //
  //                   r
  //                 ╱   ╲
  //               ╱       ╲
  //             l           u
  //           ╱   ╲
  //         ╱       ╲
  //       f           o
  //     ╱   ╲
  //   c       i

  const rightChild = right(set)

  return setLeft(rightChild, setRight(set, left(rightChild)))
}

function linkRight(params) {
  // r->left = t;  /* link right */
  // r = t;
  // t = t->left;

  const [set, leftLast, rightFirst] = params

  setLeft(rightFirst, set)

  return [left(set), leftLast, set]
}

function rotateRight() {
  // y = t->left;  /* rotate right */
  // t->left = y->right;
  // y->right = t;
  // t = y;
  // if (t->left == NULL) break;

  //             l
  //           ╱   ╲
  //         ╱       ╲
  //       f           r
  //     ╱   ╲       ╱   ╲
  //   c       i   o       u
  //
  //              ⇓
  //
  //         f
  //       ╱   ╲
  //     ╱       ╲
  //   c           l
  //             ╱   ╲
  //           ╱       ╲
  //         i           r
  //                   ╱   ╲
  //                 o       u

  const leftChild = left(set)

  return setRight(leftChild, setLeft(set, right(leftChild)))
}

// if the 'set'
//   - contains the 'item': return the set, splayed to the 'item'
//   - is empty: return the 'set' unmodified
//   - otherwise does not contain the 'item': return the 'set', splayed to a neighbor element
function splay(item, set) {
  if (isEmpty(set)) return set

  function splayStep(params) {
    let [set, leftLast, rightFirst] = params

    const cmp = defaultCompare(item, set.item)

    if (cmp < 0) {
      if (isEmpty(set.left)) {
        return [-1, set]
      }

      const cmp = defaultCompare(item, left(set).item)

      if (cmp < 0) {
        set = rotateRight(set)
        if (isEmpty(left(set))) return [-1, set]
      }

      return splayStep(linkRight([set, leftLast, rightFirst]))
    }
    else if (cmp > 0) {
      if (isEmpty(set.right)) {
        return [1, set]
      }

      const cmp = defaultCompare(item, right(set).item)

      if (cmp > 0) {
        set = rotateLeft(set)
        if (isEmpty(right(set))) return [1, set]
      }

      return splayStep(linkLeft([set, leftLast, rightFirst]))
    }
    else {
      return [0, set]
    }
  }

  return splayStep([set, null, null])
}

function has(item, set) {
  if (isEmpty(set)) {
    return false
  }

  const [cmp, splayed] = splay(item, set)

  return cmp === 0
}

function insert(item, set) {
  const node = {item, left: null, right: null}

  if (isEmpty(set)) {
    return node
  }

  const [cmp, splayed] = splay(item, set)

  if (cmp === 0) {
    return set
  }
  else if (cmp < 0) {
    return setLeft(splayed, node)
  }
  else {
    return setRight(splayed, node)
  }
}

exports.has = has
exports.insert = insert
