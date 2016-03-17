import * as instagram from './instagram'

const {INSTAGRAM_USER, INSTAGRAM_PASSWORD} = process.env

// export default function (filename, caption) {
//   return
  instagram.login(INSTAGRAM_USER, INSTAGRAM_PASSWORD)
    .then(() => instagram.mediaLikes('1208039374844282904'))
    .then((res) => console.log('result', res))
    .catch((res) => console.log('error', res))
// }
