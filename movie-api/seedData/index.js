import userModel from '../api/users/userModel'
import movieModel from '../api/movies/movieModel'
import tvShowModel from '../api/tv/tvShowModel'

const users = [
  {
    'username': 'user1',
    'password': 'test1',
  },
  {
    'username': 'user2',
    'password': 'test2',
  },
];

export async function loadUsers() {
  console.log('load user Data')
    try {
      await userModel.deleteMany()
      await users.forEach(user => userModel.create(user))
      console.info(`${users.length} users were successfully stored.`)
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`)
    }
  }

export async function removeFavorites() {
  console.log('remove favorites');
  try {
    await movieModel.deleteMany();
    await tvShowModel.deleteMany();
  } catch (err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}
