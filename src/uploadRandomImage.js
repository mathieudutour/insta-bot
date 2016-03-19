import upload from './upload'
import downloadRandomImage from './downloadRandomImage'
import findQuote from './findQuote'

const dimensions = process.env.IMAGE_DIMENSIONS || '1000x1000'

const categories = [
  'buildings',
  'food',
  'nature',
  'people',
  'technology',
  'objects'
]

const category = categories[Math.floor(Math.random() * categories.length)]

export default function () {
  return Promise.all([
    downloadRandomImage(`https://source.unsplash.com/category/${category}/${dimensions}`),
    findQuote(category)
  ])
    .then(([filename, quote]) => upload(filename, quote))
    .then((res) => console.log('result', res))
    .catch((res) => console.log('error', res))
}
