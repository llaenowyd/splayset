const { describe, it } = require('mocha')
const { expect } = require('chai')

const splayset = require('../index')

describe('splayset.has', () => {
  it('returns false for empty set', () => {
    expect(splayset.has(1, null)).to.be.false
  })

  it('returns true for one-item set having item', () => {
    expect(splayset.has(1, {item:1,left:null,right:null})).to.be.true
  })

  it('returns false for one-item set not having item', () => {
    expect(splayset.has(1, {item:0,left:null,right:null})).to.be.false
  })
})
