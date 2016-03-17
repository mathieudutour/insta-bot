export default function (promise) {
  return function (array) {
    return Promise.all(array.map((item, i) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          promise(item).then(resolve).catch(reject)
        }, i * 2000 * Math.random())
      })
    }))
  }
}
