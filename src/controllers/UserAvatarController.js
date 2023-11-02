const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorageProvider = require('../providers/DiskStorageProvider');

class UserAvatarController {
  async update(request, response) {
    const userId = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorageProvider = new DiskStorageProvider();

    const user = await knex('users').where({ id: userId }).first();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      await diskStorageProvider.deleteFile(user.avatar);
    }

    const filename = await diskStorageProvider.saveFile(avatarFilename);
    user.avatar = filename;

    await knex('users').update(user).where({ id: userId });

    return response.json(user);
  }
}

module.exports = UserAvatarController;
