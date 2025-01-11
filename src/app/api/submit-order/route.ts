import { NextResponse } from 'next/server';
import { generateOrderPDF } from '@/services/pdfGenerator';
import { sendOrderEmail } from '@/services/emailService';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received order data:', JSON.stringify(body, null, 2));

        const { customerInfo, cartData } = body;

        if (!cartData?.cart?.order) {
            throw new Error('Invalid cart data structure');
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

        // Format cart data for PDF
        const orderData = {
            packages: cartData.cart.order.map((pkg: any) => ({
                package: pkg.package,
                price: parseFloat(pkg.price),
                products: pkg.products,
                guests: pkg.guests || 1
            })),
            totalPrice: cartData.totals?.[cartData.totals.length - 1]?.text || '0.00€',
            menu: cartData.cart.menu
        };

        console.log('Formatted order data:', JSON.stringify(orderData, null, 2));

        try {
            // Generate PDF
            const doc = await generateOrderPDF({
                orderData,
                customerInfo,
                orderNumber
            });

            console.log('PDF generated successfully');

            const pdfBuffer = Buffer.from(await doc.output('arraybuffer'));

            // Send emails
            await sendOrderEmail({
                pdfBuffer,
                customerInfo,
                orderNumber
            });

            console.log('Emails sent successfully');

            return NextResponse.json({
                success: true,
                message: 'Order processed successfully',
                orderNumber
            });
        } catch (error) {
            console.error('Error details:', error);
            throw error;
        }
    } catch (error) {
        console.error('Order processing error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error processing order',
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
} 