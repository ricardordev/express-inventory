import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { prisma } from '../lib/prisma';

export interface ProductStock {
    product_id: string;
    product_name: string;
    quantity: number;
}

export interface Anomaly {
    row_number: number;
    reason: string;
    data: any;
}

export interface InventorySummary {
    current_stock: Record<string, ProductStock>;
    low_stock_alerts: ProductStock[];
    anomalies: Anomaly[];
}

interface MovementRow {
    timestamp: string;
    product_id: string;
    product_name: string;
    type: string;
    quantity: string;
}

export class InventoryService {
    private static LOW_STOCK_THRESHOLD = process.env.LOW_STOCK_THRESHOLD
        ? Number(process.env.LOW_STOCK_THRESHOLD)
        : 10;

    public static async processCsvBuffer(buffer: Buffer): Promise<InventorySummary> {
        const { inventory, anomalies, movements } = await InventoryService.parseCsv(buffer);

        await InventoryService.persistToDatabase(movements);

        const low_stock_alerts = Object.values(inventory).filter(
            (item) => item.quantity <= InventoryService.LOW_STOCK_THRESHOLD
        );

        return {
            current_stock: inventory,
            low_stock_alerts,
            anomalies
        };
    }

    private static parseCsv(buffer: Buffer): Promise<{
        inventory: Record<string, ProductStock>;
        anomalies: Anomaly[];
        movements: MovementRow[];
    }> {
        return new Promise((resolve, reject) => {
            const inventory: Record<string, ProductStock> = {};
            const anomalies: Anomaly[] = [];
            const movements: MovementRow[] = [];
            let rowCount = 1;

            const stream = Readable.from(buffer.toString('utf-8'));

            stream
                .pipe(csvParser({ headers: ['timestamp', 'product_id', 'product_name', 'type', 'quantity'], skipLines: 1 }))
                .on('data', (row) => {
                    rowCount++;
                    const { timestamp, product_id, product_name, type, quantity } = row;

                    const parsedQty = parseInt(quantity, 10);
                    const isTypeValid = type === 'in' || type === 'out';
                    const isTimestampValid = !isNaN(parseInt(timestamp, 10));

                    if (!isTimestampValid || !product_id || !isTypeValid || isNaN(parsedQty)) {
                        anomalies.push({ row_number: rowCount, reason: 'Invalid or missing data format', data: row });
                        return;
                    }

                    if (!inventory[product_id]) {
                        inventory[product_id] = { product_id: product_id, product_name: product_name, quantity: 0 };
                    }

                    const signedQty = type === 'in' ? parsedQty : -parsedQty;
                    inventory[product_id].quantity += signedQty;

                    movements.push({
                        timestamp: timestamp,
                        product_id: product_id,
                        product_name: product_name,
                        type: type,
                        quantity: quantity
                    });
                })
                .on('end', () => resolve({ inventory, anomalies, movements }))
                .on('error', (error) => reject(error));
        });
    }

    private static async persistToDatabase(movements: MovementRow[]): Promise<void> {
        if (movements.length === 0) return;

        const uniqueProducts = new Map<string, string>();
        for (const m of movements) {
            if (!uniqueProducts.has(m.product_id)) {
                uniqueProducts.set(m.product_id, m.product_name);
            }
        }

        const productIdMap = new Map<string, number>();

        for (const [code, name] of uniqueProducts.entries()) {
            const product = await prisma.product.upsert({
                where: { code: code },
                update: {},
                create: { code: code, name: name }
            });
            productIdMap.set(code, product.id);
        }

        await prisma.$transaction(
            movements.map((m) =>
                prisma.stockMovement.create({
                    data: {
                        productId: productIdMap.get(m.product_id)!,
                        type: m.type,
                        quantity: parseInt(m.quantity),
                        timestamp: new Date(parseInt(m.timestamp, 10) * 1000)
                    }
                })
            )
        );
    }
}