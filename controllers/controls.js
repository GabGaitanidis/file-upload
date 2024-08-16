const db = require("../db");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function createUser(req, res) {
  const username = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await db.userCreation(username, hashedPassword);
  res.redirect("/");
}

async function createFolder(req, res) {
  const name = req.body.folderName;
  const userId = req.user.id;
  await db.folderCreation(name, parseInt(userId));
  res.redirect("/");
}
async function displayFolder(req, res, next) {
  try {
    const { id } = req.params;

    const folder = await db.getFolder(parseInt(id));

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    const files = await db.getSpecificFiles(parseInt(folder.id));

    res.render("folder", { folder: folder, folders: files });
  } catch (error) {
    console.error("Error displaying folder:", error);
    next(error);
  }
}

async function deleteFolder(req, res) {
  const { id } = req.params;
  const folderId = parseInt(id, 10);

  const foldFiles = await db.getFolderFiles(folderId);

  for (const file of foldFiles) {
    const publicUrl = file.url;
    const publicId = publicUrl.split("/").pop().split(".")[0];

    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok") {
        return res.status(500).send("Error deleting files from Cloudinary.");
      }

      await db.fileDeletion(file.id);
    } catch (error) {
      return res.status(500).send("Error deleting files from Cloudinary.");
    }
  }

  await db.folderDeletion(folderId);
  res.redirect("/");
}

async function uploadFile(req, res) {
  const { id } = req.params;
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded.");

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res.status(500).send("Error uploading file.");
        }

        const url = result.secure_url;
        await db.fileInsertion(url, parseInt(id), file.originalname);

        res.redirect("/");
      }
    );

    uploadStream.end(file.buffer);
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
}

async function deleteFile(req, res) {
  const { id } = req.params;
  try {
    const file = await db.getFile(parseInt(id));

    if (!file) {
      return res.status(404).send("File not found.");
    }

    const publicUrl = file.url;
    const publicId = publicUrl.split("/").pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(500).send("Error deleting file from Cloudinary.");
    }

    await db.fileDeletion(parseInt(id));
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error on deletion");
  }
}

module.exports = {
  createUser,
  createFolder,
  displayFolder,
  deleteFolder,
  uploadFile,
  deleteFile,
};
