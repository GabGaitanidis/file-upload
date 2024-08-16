const { Router } = require("express");
const controls = require("../controllers/controls");
const passport = require("passport");
const multer = require("multer");
const db = require("../db");
const isAuth = require("../controllers/auth");
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", isAuth, async (req, res) => {
  const userId = req.user.id;
  const folders = await db.getFolders(userId);
  const files = await db.getFolderFiles(parseInt(userId));
  res.render("index", { user: req.user, folders: folders || [], files });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/sign-up", (req, res) => {
  res.render("sign");
});

router.post("/sign-up", controls.createUser);

router.get("/logout", isAuth, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/login");
  });
});

router.get("/folder/create", isAuth, (req, res) => {
  res.render("folderForm");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/files", isAuth, async (req, res) => {
  const files = await db.allfiles();

  res.render("allFiles", { files });
});
router.post("/folder/create", isAuth, controls.createFolder);

router.get("/folder/with/:id", isAuth, controls.displayFolder);
router.post(
  "/folder/with/:id/i",
  isAuth,
  upload.single("file"),
  controls.uploadFile
);

router.post("/folder/with/:id/delete", isAuth, controls.deleteFolder);
router.post("/files/:id", isAuth, controls.deleteFile);
module.exports = router;
