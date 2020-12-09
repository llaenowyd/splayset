# Across 110th St.

## splayset

`splay` is an operation defined on binary search trees, that results in the searched item being
moved to the root of the tree. As discussed in the original paper, linked below, this by itself
is not enough to give competitive performance. `splay` operations move a lot of nodes toward the
root, a balancing effect that causes recently accessed nodes to gravitate toward the root in
general - e.g. a `splay` operation will not result in the current root being moved further than
2 steps away.

> Splaying not only moves x to the root, but roughly halves the depth of every node along the access path.

Its runtime complexity is proven by amortization to be subject to the same asymptotic bounds as
a strictly-balancing BST such as a red-black tree.

Due to its relative simplicity and lack of book-keeping, it's a typically high-performance
binary search tree algorithm.

## background

![splay-step figure](./doc/images/sleator_splay_fig.png?raw=true)

![splay-step pseudocode](./doc/images/sleator_splay_pseudo.png?raw=true)

* [Self-Adjusting Binary Search Trees](https://www.cs.cmu.edu/~sleator/papers/self-adjusting.pdf)
* [top-down-splay.c](https://www.link.cs.cmu.edu/link/ftp-site/splaying/top-down-splay.c)
