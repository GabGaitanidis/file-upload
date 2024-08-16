const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();
async function userCreation(username, password) {
  const user = await prisma.users.create({
    data: {
      username: username,
      password: password,
    },
  });
  return user;
}

async function folderCreation(name, id) {
  const folder = await prisma.folders.create({
    data: {
      name: name,
      usersId: id,
    },
  });
  return folder;
}
async function getFolders(userId) {
  try {
    const folders = await prisma.folders.findMany({
      where: { usersId: userId },
      include: {
        files: true,
      },
    });

    return folders;
  } catch (error) {
    return [];
  }
}

async function getFolder(id) {
  const folder = await prisma.folders.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return folder;
}

async function folderDeletion(id) {
  await prisma.folders.delete({
    where: {
      id: id,
    },
  });
}
async function fileInsertion(url, id, name) {
  await prisma.files.create({
    data: {
      url: url,
      foldersId: id,
      name: name,
    },
  });
}
async function allfiles() {
  const files = await prisma.files.findMany();
  console.log(files);
  return files;
}
async function getFolderFiles(userId) {
  const folderWithFiles = await prisma.folders.findMany({
    where: {
      usersId: userId,
    },
    include: {
      files: true,
    },
  });
  return folderWithFiles;
}
async function getSpecificFiles(folderId) {
  const files = await prisma.files.findMany({
    where: {
      foldersId: folderId,
    },
  });
  return files;
}
async function deleteAllFiles(id) {
  await prisma.files.deleteMany({
    where: {
      foldersId: id,
    },
  });
}
async function fileDeletion(id) {
  await prisma.files.deleteMany({
    where: {
      id: id,
    },
  });
}
async function getFile(id) {
  const file = await prisma.files.findUnique({
    where: {
      id: id,
    },
  });
  console.log(file);
  return file;
}
module.exports = {
  userCreation,
  folderCreation,
  getFolders,
  getFolder,
  folderDeletion,
  fileInsertion,
  allfiles,
  getFolderFiles,
  deleteAllFiles,
  fileDeletion,
  getFile,
  getSpecificFiles,
};
