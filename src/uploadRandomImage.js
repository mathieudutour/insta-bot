import upload from './upload'
import downloadRandomImage from './downloadRandomImage'

const captionText = ''

const dimensions = process.env.IMAGE_DIMENSIONS || '400x400'

const categories = [
  'buildings',
  'food',
  'nature',
  'people',
  'technology',
  'objects'
]

const category = categories[Math.floor(Math.random() * categories.length)]

export default function (nbOfUsersToFollow) {
  return downloadRandomImage(`https://source.unsplash.com/category/${category}/${dimensions}`)
    .then((filename) => upload(filename, captionText))
    .then((res) => console.log('result', res))
    .catch((res) => console.log('error', res))
}
