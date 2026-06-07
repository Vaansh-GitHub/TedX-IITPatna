import express from 'express';

import { sendEmailHandler } from '../controllers/mail.controllers.js';
import {
  deleteEmailTemplateHandler,
  updateEmailTemplateHandler,
  uploadEmailTemplateHandler,
} from '../controllers/email_template.controllers.js';

const router = express.Router();

router.post("/", sendEmailHandler);
router.post("/template", uploadEmailTemplateHandler);
router.delete("/template", deleteEmailTemplateHandler);
router.post("/template/:id", updateEmailTemplateHandler);

export default router;
