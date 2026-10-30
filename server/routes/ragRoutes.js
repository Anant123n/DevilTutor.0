import express from "express";
import multer from "multer";
import { askDocument, uploadPdf } from "../controllers/ragController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
});

router.post("/upload", upload.single("pdf"), uploadPdf);
router.post("/ask", askDocument);

export default router;
