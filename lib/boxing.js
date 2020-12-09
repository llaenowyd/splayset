
// tbd

const mutate = () => {}

const makeFactory = s => initParams => {

  const { publicMethod } = new class {
    constructor() {
      this._val = create(constructionParams)
    }

    publicMethod = () => {
      mutate(this.val);
    }
  }

  return { publicMethod }
}
