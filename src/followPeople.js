import * as instagram from './instagram'
import asyncDeferRandom from './asyncDeferRandom'

const {INSTAGRAM_USER, INSTAGRAM_PASSWORD} = process.env

export default function (nbOfUsersToFollow) {
  return instagram.login(INSTAGRAM_USER, INSTAGRAM_PASSWORD)
    .then(instagram.getFollowing)
    .then((res) => JSON.parse(res).users.map((user) => user.pk))
    .then(asyncDeferRandom(instagram.unfollow))
    .then(instagram.popular)
    .then((res) => JSON.parse(res).items[0].id)
    .then(instagram.mediaLikes)
    .then((res) => JSON.parse(res).users)
    .then((users) => users.map((user) => user.pk))
    .then((userIds) => userIds.slice(0, nbOfUsersToFollow))
    .then(asyncDeferRandom(instagram.follow))
}
