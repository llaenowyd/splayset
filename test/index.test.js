const { describe, it } = require('mocha')
const { expect } = require('chai')

const clone = require('ramda/src/clone')

const splayset = require('../index')

describe('splayset.splay', () => {
  const sampleSet = {
    item: 16,
    left: {
      item: 8,
      left: {
        item: 4,
        left: {
          item: 2,
          left: null,
          right: null
        },
        right: {
          item: 6,
          left: null,
          right: null
        }
      },
      right: {
        item: 12,
        left: {
          item: 10,
          left: null,
          right: null
        },
        right: {
          item: 14,
          left: null,
          right: null
        }
      }
    },
    right: {
      item: 24,
      left: {
        item: 20,
        left: {
          item: 18,
          left: null,
          right: null
        },
        right: {
          item: 22,
          left: null,
          right: null
        }
      },
      right: {
        item: 28,
        left: {
          item: 26,
          left: null,
          right: null
        },
        right: {
          item: 30,
          left: null,
          right: null
        }
      }
    }
  }

  it('splay works as described', () => {
    for (let i = 1; i <= 30; i++) {
      const set = clone(sampleSet)

      const [indicator, splayedSet] = splayset.splay(i, set)

      if ((i & 1) === 0) {
        expect(indicator).to.equal(0)
        expect(splayedSet.item).to.equal(i)
      }
      else {
        expect(indicator === -1 || indicator === 1).to.be.true

        if (indicator < 0) {
          expect(splayedSet.item).to.be.greaterThan(i)
        }
        else {
          expect(splayedSet.item).to.be.lessThan(i)
        }
      }
    }
  })
})

describe('splaySet implementation methods', () => {
  const sampleSet = {
    item: 16,
    left: {
      item: 8,
      left: {
        item: 4,
        left: null,
        right: null
      },
      right: {
        item: 12,
        left: null,
        right: null
      }
    },
    right: {
      item: 24,
      left: {
        item: 20,
        left: null,
        right: null
      },
      right: {
        item: 28,
        left: null,
        right: null
      }
    }
  }

  it('linkLeft', () => {
    const sample = clone(sampleSet)
    const [nextSet, nextLeftLast, nextRightFirst] =
      splayset.test.linkLeft([
        sample,
        sample.left.right,
        sample.right.left
      ])

    expect(sample.item).to.equal(16)
    expect(nextSet.item).to.equal(24)
    expect(nextLeftLast.item).to.equal(16)
    expect(nextRightFirst.item).to.equal(20)
  })

  it('linkRight', () => {
    const sample = clone(sampleSet)
    const [nextSet, nextLeftLast, nextRightFirst] =
      splayset.test.linkRight([
        sample,
        sample.left.right,
        sample.right.left
      ])

    expect(sample.item).to.equal(16)
    expect(nextSet.item).to.equal(8)
    expect(nextLeftLast.item).to.equal(12)
    expect(nextRightFirst.item).to.equal(16)
  })

  it('rotateLeft', () => {
    const sample = clone(sampleSet)
    const rotated = splayset.test.rotateLeft(sample)

    expect(rotated.item).to.equal(24)
    expect(rotated.right.item).to.equal(28)
    expect(rotated.right.left).to.be.null
    expect(rotated.right.right).to.be.null
    expect(rotated.left.item).to.equal(16)
    expect(rotated.left.right.item).to.equal(20)
    expect(rotated.left.right.left).to.be.null
    expect(rotated.left.right.right).to.be.null
    expect(rotated.left.left.item).to.equal(8)
    expect(rotated.left.left.left.item).to.equal(4)
    expect(rotated.left.left.left.left).to.be.null
    expect(rotated.left.left.left.right).to.be.null
    expect(rotated.left.left.right.item).to.equal(12)
    expect(rotated.left.left.right.left).to.be.null
    expect(rotated.left.left.right.right).to.be.null
  })

  it('rotateRight', () => {
    const sample = clone(sampleSet)

    const rotated = splayset.test.rotateRight(sample)

    expect(rotated.item).to.equal(8)
    expect(rotated.left.item).to.equal(4)
    expect(rotated.left.left).to.be.null
    expect(rotated.left.right).to.be.null
    expect(rotated.right.item).to.equal(16)
    expect(rotated.right.left.item).to.equal(12)
    expect(rotated.right.left.left).to.be.null
    expect(rotated.right.left.right).to.be.null
    expect(rotated.right.right.item).to.equal(24)
    expect(rotated.right.right.left.item).to.equal(20)
    expect(rotated.right.right.left.left).to.be.null
    expect(rotated.right.right.left.right).to.be.null
    expect(rotated.right.right.right.item).to.equal(28)
    expect(rotated.right.right.right.left).to.be.null
    expect(rotated.right.right.right.right).to.be.null
  })
})

describe('splayset.has', () => {
  it('returns false for empty set', () => {
    expect(splayset.has(1, null)).to.be.false
  })

  it('returns true for one-item set having item', () => {
    expect(splayset.has(1, {item: 1, left: null, right: null})).to.be.true
  })

  it('returns false for one-item set not having item', () => {
    expect(splayset.has(1, {item: 0, left: null, right: null})).to.be.false
  })
})
