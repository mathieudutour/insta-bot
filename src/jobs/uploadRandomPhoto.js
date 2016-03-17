import uploadRandomImage from '../uploadRandomImage'

uploadRandomImage()
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
