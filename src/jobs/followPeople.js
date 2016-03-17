import followPeople from '../followPeople'

followPeople(process.env.NB_USERS_TO_FOLLOW || 50)
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
