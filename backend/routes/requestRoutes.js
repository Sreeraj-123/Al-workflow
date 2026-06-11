const express = require("express");

const {
  login,
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  addNote,
} = require("../controllers/requestController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

// Protected Routes
router.post(
  "/requests",
  authMiddleware,
  createRequest
);

router.get(
  "/requests",
  authMiddleware,
  getRequests
);

router.get(
  "/requests/:id",
  authMiddleware,
  getRequestById
);

router.patch(
  "/requests/:id/status",
  authMiddleware,
  updateStatus
);

router.post(
  "/requests/:id/notes",
  authMiddleware,
  addNote
);

module.exports = router;