import * as instagram from './instagram'
import asyncDeferRandom from './asyncDeferRandom'

const {INSTAGRAM_USER, INSTAGRAM_PASSWORD} = process.env

export default function (nbOfUsersToFollow) {
  return instagram.login(INSTAGRAM_USER, INSTAGRAM_PASSWORD)
    .then((res) => JSON.parse(res).logged_in_user.pk)
    .then(instagram.getFollowing)
    .then((res) => JSON.parse(res).users.map((user) => user.pk))
    .then(asyncDeferRandom(instagram.unfollow))
    .then(instagram.popular)
    .then((res) => JSON.parse(res).items)
    .then((popularMedia) => popularMedia.reduce((prev, media) => prev.concat(media.comments), []).map((comment) => comment.user_id))
    .then((userIds) => userIds.slice(0, nbOfUsersToFollow))
    .then(asyncDeferRandom(instagram.follow))
}
