// splay.js
//
// basic `splay` algo and related subroutines
//
// Comments marked `_pseudo_` are copied from the original paper
// and those marked `_C_` are copied from the C implementation,
// both linked in this package's `README.md`.

// tbd: supposing a set of numbers is all that's required
function defaultCompare(item1, item2) { return item1 - item2 }

// tbd: test after removal of last remaining element
function isEmpty(set) { return !set }

function _item(node) { return node ? node.item : null }
function _left(node) { return node ? node.left : null }
function _right(node) { return node ? node.right : null }

function build(a) {
  if (!a || !Array.isArray(a)) return null

  let result = null

  for (let item of a) {
    result = insert(item, result)
  }

  return result
}

function has(item, set) {
  if (isEmpty(set)) {
    return [false, null]
  }

  const [cmp, splayed] = splay(item, set)

  return [cmp === 0, splayed]
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
    if (splayed.left) splayed.left.right = node
    else splayed.left = node
  }
  else {
    if (splayed.right) splayed.right.left = node
    else splayed.right = node
  }

  return splayed
}

function splay(item, set) {
  // _pseudo_
  // procedure simple_topdown_splay(i, t);
  //   if l, r: l = r = null ->
  //     left(null) := right(null) := null;
  //     do i < item(t) ->
  //         if i < item(left(t)) -> rotate_right
  //          | i >= item(left(t)) -> skip
  //         fi;
  //         link_right
  //      | i > item(t) ->
  //         if i > item(right(t)) -> rotate_left
  //          | i <= item(right(t)) -> skip
  //         fi;
  //         link_left
  //     od {i=item(t)};
  //     assemble
  //   fi
  // end simple_topdown_splay;

  // _C_
  // Tree * splay (int i, Tree * t) {
  //   /* Simple top down splay, not requiring i to be in the tree t.  */
  //   /* What it does is described above.                             */
  //   Tree N, *l, *r, *y;
  //   if (t == NULL) return t;
  //   N.left = N.right = NULL;
  //   l = r = &N;
  //
  //   for (;;) {
  //     if (i < t->item) {
  //       if (t->left == NULL) break;
  //       if (i < t->left->item) {
  //         y = t->left;                           /* rotate right */
  //         t->left = y->right;
  //         y->right = t;
  //         t = y;
  //         if (t->left == NULL) break;
  //       }
  //       r->left = t;                               /* link right */
  //       r = t;
  //       t = t->left;
  //     } else if (i > t->item) {
  //       if (t->right == NULL) break;
  //       if (i > t->right->item) {
  //         y = t->right;                          /* rotate left */
  //         t->right = y->left;
  //         y->left = t;
  //         t = y;
  //         if (t->right == NULL) break;
  //       }
  //       l->right = t;                              /* link left */
  //       l = t;
  //       t = t->right;
  //     } else {
  //       break;
  //     }
  //   }
  //   l->right = t->left;                                /* assemble */
  //   r->left = t->right;
  //   t->left = N.right;
  //   t->right = N.left;
  //   return t;
  // }

  if (isEmpty(set)) return [-1, set]

  let node = { item: null, left: null, right: null }
  let left = node
  let right = node
  let tmp = null
  let cmp = 0

  for (;;) {
    cmp = defaultCompare(item, _item(set))

    if (cmp < 0) {
      if (isEmpty(_left(set))) break

      cmp = defaultCompare(item, _item(_left(set)))

      if (cmp < 0) {
        // rotate_right
        tmp = _left(set)
        set.left = _right(tmp)
        tmp.right = set
        set = tmp
        if (isEmpty(_left(set))) break
      }

      // link_right
      right.left = set
      right = set
      set = _left(set)
    }
    else if (cmp > 0) {
      if (isEmpty(_right(set))) break

      cmp = defaultCompare(item, _item(_right(set)))

      if (cmp > 0) {
        // rotate_left
        tmp = _right(set)
        set.right = _left(tmp)
        tmp.left = set
        set = tmp
        if (isEmpty(_right(set))) break
      }

      // link_left
      left.right = set
      left = set
      set = _right(set)
    }
    else {
      break
    }
  }

  // assemble
  left.right = _left(set)
  right.left = _right(set)
  set.left = _right(node)
  set.right = _left(node)

  return [cmp, set]
}

exports.build = build
exports.has = has
exports.insert = insert
exports.splay = splay
