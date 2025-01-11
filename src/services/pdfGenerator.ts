import { jsPDF } from 'jspdf';
import autoTable, { RowInput, CellInput, Styles } from 'jspdf-autotable';
import { CheckoutFormData } from '@/components/Checkout/CheckoutForm';
import { getPackageMenuId } from '@/utils/menuUtils';
import { MENU_CONTENTS } from '@/constants/categories';
// import loadImageAsBase64 from '@/utils/loadImageInPdf';

interface Product {
    name: string;
    quantity: string;
    price: number;
    total: number;
}

interface Package {
    package: string;
    price: number;
    products: {
        [key: string]: Array<{
            name: string;
            quantity: string;
            price: number;
            total: number;
        }>;
    };
    guests?: number;
}

interface MenuContent {
    name: string;
    ids: number[];
    count: number;
}

interface Menu {
    name: string;
    id: number;
    price: number;
    contents: MenuContent[];
}

interface GeneratePDFProps {
    orderData: {
        packages: Package[];
        totalPrice: string;
        menu?: Menu;
    };
    customerInfo: CheckoutFormData;
    orderNumber: string;
}

type Color = [number, number, number];

const colors = {
    primary: [40, 167, 69] as Color,     // Green
    secondary: [238, 247, 240] as Color,  // Light green bg
    text: [33, 37, 41] as Color,         // Dark gray
    muted: [108, 117, 125] as Color,     // Muted text
    border: [222, 226, 230] as Color,    // Light border
    tableHeader: [40, 167, 69] as Color  // Changed from yellow to green
};

interface CellStyle extends Partial<Styles> {
    fillColor?: Color;
    textColor?: Color;
    fontStyle?: 'normal' | 'bold' | 'italic';
    halign?: 'left' | 'center' | 'right';
    fontSize?: number;
    cellPadding?: number | { top: number; right: number; bottom: number; left: number };
}

const createCell = (
    content: string,
    styles: CellStyle,
    colSpan?: number
): CellInput => ({
    content,
    colSpan,
    styles: styles as Styles
});

export const generateOrderPDF = async ({
    orderData,
    customerInfo,
    orderNumber,
}: GeneratePDFProps) => {
    const doc = new jsPDF();

    // Set global text color
    doc.setTextColor(33, 37, 41);

    // try {
    //     const base64Logo = await loadImageAsBase64('/logos/logo.png');
    //     doc.addImage(base64Logo, 'PNG', 15, 10, 20, 10);
    // } catch (error) {
    //     console.error('Error adding logo to PDF:', error);
    // }

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Grindel Restaurant', 40, 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Catering-Auftrag', 40, 20);

    // Order Number & Date
    doc.setFontSize(10);
    doc.text(`Bestellnummer: ${orderNumber}`, 15, 30);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 15, 35);

    // Customer Information
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Kundeninformationen', 20, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(
        [
            `${customerInfo.firstName} ${customerInfo.lastName}`,
            customerInfo.address,
            `${customerInfo.postalCode} ${customerInfo.city}`,
            `Tel: ${customerInfo.phone}`,
            `Email: ${customerInfo.email}`,
        ],
        20,
        52,
        { lineHeightFactor: 1.2 }
    );

    // Order Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bestelldetails', 15, 80);

    const tableData: RowInput[] = [];
    let calculatedSubTotal = 0;
    let extrasTotal = 0;

    // Process each package
    if (Array.isArray(orderData.packages)) {
        orderData.packages.forEach((pkg, index) => {
            // Base package price = package price * number of guests
            const basePackagePrice = pkg.price * (pkg.guests || 1);
            let productsOver5Total = 0;

            // Add package header
            tableData.push([
                createCell(
                    `${pkg.package}${pkg.guests ? ` (${pkg.guests} Gäste)` : ''}`,
                    {
                        fontStyle: 'bold',
                        fillColor: colors.primary,
                        textColor: [255, 255, 255],
                        fontSize: 11,
                        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 }
                    },
                    2
                ),
                createCell(
                    `${pkg.price}€`,
                    {
                        fontStyle: 'bold',
                        fillColor: colors.primary,
                        textColor: [255, 255, 255],
                        halign: 'right',
                        fontSize: 11
                    }
                )
            ]);

            // Get menu contents either from API or fallback
            const menuId = getPackageMenuId(pkg.package);
            const menuContents =
                orderData.menu?.contents ||
                (menuId ? MENU_CONTENTS[menuId] : []);

            // Get extra category IDs
            const extraIds = menuContents?.find(
                content => content.name === "Extras"
            )?.ids || ["73", "74"];

            // Process products
            if (pkg.products) {
                // Group products by category
                const groupedProducts: { [key: string]: Array<Product> } = {};

                Object.entries(pkg.products).forEach(([categoryId, products]) => {
                    if (Array.isArray(products)) {
                        // Get category name from menu contents
                        let categoryName = "Andere";
                        const category = menuContents?.find((content) =>
                            content.ids.includes(parseInt(categoryId))
                        );
                        if (category?.name) {
                            categoryName = category.name;
                        }

                        // Initialize category array if needed
                        if (!groupedProducts[categoryName]) {
                            groupedProducts[categoryName] = [];
                        }

                        products.forEach((product) => {
                            // Calculate totals
                            const quantity = Number(product.quantity);
                            if (quantity >= 5 && quantity % 5 === 0 && product.price > 0) {
                                productsOver5Total += product.total;
                            }
                            // Add to extras total if in extra categories and not ≥10
                            else if (extraIds.includes(parseInt(categoryId) as never)) {
                                extrasTotal += product.total || 0;
                            }

                            // Add to grouped products for display
                            groupedProducts[categoryName].push(product);
                        });
                    }
                });

                // Add products to table by category
                Object.entries(groupedProducts).forEach(([categoryName, products]) => {
                    // Add category header
                    tableData.push([
                        createCell(
                            categoryName,
                            {
                                fontStyle: 'bold',
                                fillColor: colors.secondary,
                                fontSize: 10,
                                textColor: colors.text
                            },
                            3
                        )
                    ]);

                    // Add products in this category
                    products.forEach((product) => {
                        const price = product.total > 0 ? `${product.total}€` : `${product.price}€`;
                        tableData.push([product.name, product.quantity, price]);
                    });
                });
            }

            // Calculate package total (base price + products ≥10)
            const packageTotal = basePackagePrice + productsOver5Total;
            calculatedSubTotal += packageTotal;

            // Add package subtotal
            tableData.push([
                createCell(
                    'Zwischensumme',
                    {
                        fontStyle: 'bold',
                        fillColor: colors.secondary,
                        fontSize: 10
                    },
                    2
                ),
                createCell(
                    `${packageTotal.toFixed(2)}€`,
                    {
                        fontStyle: 'bold',
                        fillColor: colors.secondary,
                        halign: 'right',
                        fontSize: 10
                    }
                )
            ]);

            // Add spacer between packages
            if (index < orderData.packages.length - 1) {
                tableData.push([createCell('', { minCellHeight: 3 }, 3)]);
            }
        });
    }

    // Table configuration
    autoTable(doc, {
        startY: 100,
        head: [['Artikel', 'Menge', 'Preis']],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 9,
            cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
            overflow: 'linebreak',
            cellWidth: 'wrap',
            valign: 'middle',
            lineColor: colors.border,
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: colors.tableHeader,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250] as Color
        },
    });

    // Updated totals section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.roundedRect(15, finalY, 180, 35, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(`Zwischensumme:`, 20, finalY + 10);
    doc.text(`Extras:`, 20, finalY + 20);

    // Right-aligned amounts
    doc.setFont('helvetica', 'bold');
    doc.text(`${calculatedSubTotal.toFixed(2)}€`, 185, finalY + 10, { align: 'right' });
    doc.text(`${extrasTotal.toFixed(2)}€`, 185, finalY + 20, { align: 'right' });

    // Final total with green color
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(15, finalY + 25, 180, 0.5, 0, 0, 'F');  // Separator line

    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(12);
    doc.text(`Gesamtbetrag:`, 20, finalY + 33);
    doc.text(`${(calculatedSubTotal + extrasTotal).toFixed(2)}€`, 185, finalY + 33, { align: 'right' });

    // Modern footer with logo and info
    const footerY = doc.internal.pageSize.height - 25;

    // Footer separator
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(15, footerY, 180, 0.5, 0, 0, 'F');

    // Footer content
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.muted[0], colors.muted[1], colors.muted[2]);

    // Company name in bold
    doc.setFont('helvetica', 'bold');
    doc.text('Grindel Restaurant', 15, footerY + 7);

    // Contact information
    doc.setFont('helvetica', 'normal');
    doc.text([
        'Möllner Landstraße 3',
        '20144 Hamburg'
    ], 15, footerY + 12, { lineHeightFactor: 1.2 });

    // Contact details on the right
    doc.text([
        'Tel: +49 408 470 82',
        'Email: info@grindelbackhaus.de'
    ], 195, footerY + 12, { align: 'right', lineHeightFactor: 1.2 });

    return doc;
};

