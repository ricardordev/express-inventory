import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';

export class InventoryController {
    public static async analyze(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'CSV file is required. Use the "file" field.' });
                return;
            }

            const validMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/octet-stream'];
            const isCsvExtension = req.file.originalname.toLowerCase().endsWith('.csv');

            if (!validMimeTypes.includes(req.file.mimetype) || !isCsvExtension) {
                res.status(400).json({ error: 'File must be a valid CSV format.' });
                return;
            }

            const summary = await InventoryService.processCsvBuffer(req.file.buffer);
            res.status(200).json(summary);
        } catch (error) {
            console.error('[InventoryController] Internal error:', error);
            res.status(500).json({ error: 'Internal server error while processing the file.' });
        }
    }
}