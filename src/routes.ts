import { Router } from 'express';
import multer from 'multer';
import { InventoryController } from './controllers/inventory.controller';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/inventory', upload.single('file'), InventoryController.analyze);

export default router;