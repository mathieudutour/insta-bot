import * as instagram from './instagram'
import asyncDeferRandom from './asyncDeferRandom'

const {INSTAGRAM_USER, INSTAGRAM_PASSWORD} = process.env

export default function (nbOfUsersToFollow) {
  return instagram.login(INSTAGRAM_USER, INSTAGRAM_PASSWORD)
    .then(instagram.getFollowing)
    .then((res) => JSON.parse(res).users.map((user) => user.pk))
    .then((res) => { console.log(`unfollowing ${res.length} people`); return res })
    .then(asyncDeferRandom(instagram.unfollow))
    .then(instagram.popular)
    .then((res) => JSON.parse(res).items)
    .then((medias) => medias.map((media) => media.id))
    .then((mediaIds) => Promise.all(mediaIds.map((mediaId) => instagram.mediaComments(mediaId))))
    .then((comments) => comments.map((commentsObj) => JSON.parse(commentsObj).comments))
    .then((comments) => comments.reduce((prev, commentsArray) => prev.concat(commentsArray), []))
    .then((comments) => comments.map((comment) => comment.user))
    .then((users) => users.slice(0, nbOfUsersToFollow))
    .then((users) => users.map((user) => user.pk))
    .then(asyncDeferRandom(instagram.follow))
    .then((followed) => `followed ${followed.length} people (${followed.filter((f) => JSON.parse(f).friendship_status.is_private).length} private)`)
}
