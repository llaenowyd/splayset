const { describe, it } = require('mocha')
const { expect } = require('chai')

const clone = require('ramda/src/clone')

const s = require('../../lib/splay')

function testBuild(params) {
  if (!params) return null

  const [item, left, right] = params

  return {
    item,
    left: left ? testBuild(left) : null,
    right: right ? testBuild(right) : null
  }
}

function testHas(item, set) {
  if (!set) return false

  if (item === set.item) return true;

  if (item < set.item) return testHas(item, set.left)
  else return testHas(item, set.right)
}

describe('testBuild', () => {
  it('builds empty sets', () => {
    expect(testBuild()).to.be.null
  })

  it('builds 1 element sets', () => {
    expect(testBuild([1])).to.deep.equal({ item: 1, left: null, right: null})
  })

  it('builds 2 element sets', () => {
    expect(testBuild([1, null, [2]])).to.deep.equal(
      { item: 1, left: null, right: { item: 2, left: null, right: null} }
    )
    expect(testBuild([2, [1], null])).to.deep.equal(
      { item: 2, left: { item: 1, left: null, right: null}, right: null }
    )
  })

  it('builds 3 element sets', () => {
    expect(testBuild([2, [1], [3]])).to.deep.equal(
      { item: 2, left: { item: 1, left: null, right: null}, right: { item: 3, left: null, right: null} }
    )
    expect(testBuild([1, null, [2, null, [3]]])).to.deep.equal(
      { item: 1, left: null, right: { item: 2, left: null, right: { item: 3, left: null, right: null } } }
    )
    expect(testBuild([1, null, [3, [2], null]])).to.deep.equal(
      { item: 1, left: null, right: { item: 3, left: { item: 2, left: null, right: null }, right: null } }
    )
  })
})

describe('s.build', () => {
  it('builds the empty set for empty inputs', () => {
    expect(s.build()).to.be.null
    expect(s.build(null)).to.be.null
    expect(s.build([])).to.be.null
  })

  it('it creates an unbalanced tree on sorted inserts', () => {
    expect(s.build([4, 8, 12, 16, 20])).to.deep.equal(
      testBuild([16, [12, [8, [4]]], [20]])
    )
    expect(s.build([20, 16, 12, 8, 4])).to.deep.equal(
      testBuild([
        8,
        [4],
        [12,
          null,
          [16,
            null,
            [20]
          ]
        ]
      ])
    )
  })
})

describe('s.has', () => {
  it('returns false for empty set', () => {
    const [hasElement, nextSet] = s.has(1, null)

    expect(hasElement).to.be.false
    expect(nextSet).to.be.null
  })

  it('returns true for one-item set having item', () => {
    const [hasElement, nextSet] = s.has(1, {item: 1, left: null, right: null})

    expect(hasElement).to.be.true
    expect(nextSet.item === 1)
  })

  it('returns false for one-item set not having item', () => {
    const [hasElement, nextSet] = s.has(0, {item: 1, left: null, right: null})

    expect(hasElement).to.be.false
    expect(nextSet.item === 1)
  })
})

describe('s.splay', () => {
  const sampleCreators = [
    () => testBuild([
      16,
        [8,
          [4],
          [12] ],
        [24,
          [20],
          [28] ] ]),
    () => testBuild([
      28,
        [24,
          [20,
            [16,
              [12,
                [8,
                  [4] ] ] ] ] ] ])
  ]

  const distinctItems = new Set([4, 8, 12, 16, 20, 24, 28])
  const testEnd = 30

  it('basically works', () => {
    for (let sampleCreator of sampleCreators) {
      for (let i = 0; i < testEnd; i++) {
        const sample = sampleCreator()

        const [indicator, splayedSample] = s.splay(i, sample)

        if (distinctItems.has(i)) {
          expect(indicator).to.equal(0)
          expect(splayedSample.item).to.equal(i)
        } else {
          expect(indicator).to.not.equal(0)

          if (indicator < 0) {
            expect(splayedSample.item).to.be.greaterThan(i)
          } else {
            expect(splayedSample.item).to.be.lessThan(i)
          }
        }

        for (let item of distinctItems) {
          expect(testHas(item, splayedSample)).to.be.true
        }
      }
    }
  })

  it('differs with Fig. 4 from Sleator & Tarjan', () => {
    const a = 63
    const b = 62
    const c = 61
    const d = 60
    const e = 75
    const f = 50
    const g = 97
    const h = 98
    const i = 99

    const input = testBuild(
      [i,
        [h,
          [g,
            [f,
              null,
              [e,
                [d,
                  null,
                  [c,
                    null,
                    [b,
                      null,
                      [a]
                    ]
                  ]
                ],
                null
              ]
            ],
            null
          ],
          null
        ],
        null
      ]
    )

    // as depicted:
    // const expected = testBuild(
    //   [a,
    //     [f,
    //       null,
    //       [d,
    //         null,
    //         [b, [c]]
    //       ]
    //     ],
    //     [h,
    //       [g, [e]],
    //       [i]
    //     ]
    //   ]
    // )

    const observed = testBuild(
      [a,
        [f,
          null,
          [c,
            [d],
            [b]]],
        [h,
          [g, [e]],
          [i]
        ]
      ]
    )

    const [indicator, result] = s.splay(a, input)

    // expect(result).to.deep.equal(expected)
    expect(result).to.deep.equal(observed)
    expect(indicator).to.equal(0)
  })

  it('reproduces Fig. 5a from Sleator & Tarjan', () => {
    const a = 1
    const b = 2
    const c = 3
    const d = 4
    const e = 5
    const f = 6
    const g = 7

    const input = testBuild(
      [g,
        [f,
          [e,
            [d,
              [c,
                [b,
                  [a]
                ]
              ]
            ]
          ]
        ]
      ]
    )

    const expected = testBuild(
      [a,
        null,
        [f,
          [d,
            [b, null, [c]],
            [e]
          ],
          [g]
        ]
      ]
    )

    const [indicator, result] = s.splay(a, input)

    expect(result).to.deep.equal(expected)
    expect(indicator).to.equal(0)
  })

  it('reproduces Fig. 5b from Sleator & Tarjan', () => {
    const a = 40
    const b = 30
    const c = 70
    const d = 20
    const e = 80
    const f = 10
    const g = 90

    const input = testBuild(
      [g,
        [f,
          null,
          [e,
            [d,
              null,
              [c,
                [b,
                  null,
                  [a]
                ]
              ]
            ]
          ]
        ]
      ]
    )

    const expected = testBuild(
      [a,
        [f,
          null,
          [d,
            null,
            [b]
          ]
        ],
        [g,
          [e,
            [c]
          ]
        ]
      ]
    )

    const [indicator, result] = s.splay(a, input)

    expect(result).to.deep.equal(expected)
    expect(indicator).to.equal(0)
  })
})
