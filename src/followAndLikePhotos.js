import * as instagram from './instagram'
import asyncDeferRandom from './asyncDeferRandom'

export default function (userId) {
  let result
  return instagram.follow(userId)
    .then((res) => { result = res; return instagram.userTimeline(userId) })
    .then((res) => JSON.parse(res).items.slice(0, 2))
    .then((medias) => medias.map((media) => media.id))
    .then(asyncDeferRandom(instagram.like))
    .then(() => result)
}
