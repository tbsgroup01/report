const archiver = require('archiver');
const playwright = require('playwright'); // or const puppeteer = require('puppeteer');

export const getFilteredZipReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    if (!id || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: "Missing required parameters." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    // Optimized database query (same as before)
    const user = await User.findOne({ _id: id })
        .populate({
            path: "report",
            match: { createdAt: { $gte: start, $lte: end } },
            select: 'createdAt product'
        })
        .lean();

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.deniedReportAccess === "yes") {
        return res.status(403).json({ success: false, message: "You don't have permission to view the report." });
    }

    const reports = user.report || [];
    if (reports.length === 0) {
        return res.status(200).json(new apiResponse("", "No reports generated yet.", true));
    }

    // Group reports into pages (same logic as before)
    const estimateReportHeight = (report) => {
        const baseHeight = 120;
        const rowHeight = 30;
        const productCount = (report.product || []).length;
        const headerHeight = 40;
        return baseHeight + headerHeight + (productCount * rowHeight);
    };

    const PAGE_HEIGHT = 1100;
    const REPORT_SPACING = 30;

    const groupReportsIntoPages = (reports) => {
        const pages = [];
        let currentPage = [];
        let currentPageHeight = 0;

        reports.forEach((report, index) => {
            const reportHeight = estimateReportHeight(report);
            const spacingHeight = currentPage.length > 0 ? REPORT_SPACING : 0;

            if (currentPageHeight + reportHeight + spacingHeight <= PAGE_HEIGHT) {
                currentPage.push({ report, index });
                currentPageHeight += reportHeight + spacingHeight;
            } else {
                if (currentPage.length > 0) {
                    pages.push(currentPage);
                }
                currentPage = [{ report, index }];
                currentPageHeight = reportHeight;
            }
        });

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        return pages;
    };

    const reportPages = groupReportsIntoPages(reports);

    // Generate HTML pages (same as before)
    const htmlPages = reportPages.map((pageReports, pageIndex) => {
        const reportsHTML = pageReports.map(({ report, index }) => {
            const rows = (report.product || []).map(p => `
                <tr>
                    <td>${user.corrupted ? corruptText(p.productName || '') : p.productName}</td>
                    <td>${user.corrupted ? corruptText(p.qty || "0") : p.qty}</td>
                    <td>${user.corrupted ? corruptText(p.rate || "0") : p.rate}</td>
                </tr>
            `).join("");

            return `
                <div class="report-section">
                    <h2>Report ${index + 1}</h2>
                    <p class="report-date">Created At: ${new Date(report.createdAt).toISOString().slice(0, 19).replace("T", " ")}</p>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }).join("");

        return `
            <html>
            <head>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 30px; 
                        margin: 0;
                        background: white;
                        font-size: 14px;
                        line-height: 1.4;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                    
                    .page-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 15px;
                    }
                    
                    .page-header h1 {
                        margin: 0;
                        color: #333;
                        font-size: 24px;
                    }
                    
                    .page-info {
                        margin: 5px 0;
                        color: #666;
                        font-size: 12px;
                    }
                    
                    .report-section {
                        margin-bottom: 25px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }
                    
                    .report-section:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    
                    .report-section h2 {
                        margin: 0 0 8px 0;
                        color: #444;
                        font-size: 18px;
                        border-left: 4px solid #007bff;
                        padding-left: 10px;
                    }
                    
                    .report-date {
                        margin: 0 0 15px 0;
                        color: #666;
                        font-size: 12px;
                        font-style: italic;
                    }
                    
                    .report-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 0;
                        font-size: 13px;
                    }
                    
                    .report-table th, 
                    .report-table td { 
                        border: 1px solid #ddd; 
                        padding: 8px 10px; 
                        text-align: left; 
                    }
                    
                    .report-table th { 
                        background-color: #f8f9fa; 
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .report-table tr:nth-child(even) {
                        background-color: #fafafa;
                    }
                    
                    .report-table tr:hover {
                        background-color: #f0f0f0;
                    }
                </style>
            </head>
            <body>
                <div class="page-header">
                    <h1>User Report</h1>
                    <div class="page-info">Page ${pageIndex + 1} of ${reportPages.length}</div>
                    <div class="page-info">Generated on ${new Date().toLocaleString()}</div>
                </div>
                
                <div class="reports-container">
                    ${reportsHTML}
                </div>
            </body>
            </html>
        `;
    });

    // OPTION 1: Using Playwright (Recommended - Much Faster)
    const browser = await playwright.chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    try {
        // Process ALL pages in parallel (much faster than batching)
        const imagePromises = htmlPages.map(async (html, index) => {
            const page = await browser.newPage();

            // Optimized viewport
            await page.setViewport({
                width: 1000,
                height: 1400,
                deviceScaleFactor: 1.5
            });

            // Block unnecessary resources for speed
            await page.route('**/*', (route) => {
                const resourceType = route.request().resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    route.abort();
                } else {
                    route.continue();
                }
            });

            await page.setContent(html, { waitUntil: 'domcontentloaded' });

            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: true,
                quality: 90 // Optimize for speed vs quality
            });

            await page.close();
            return { buffer: screenshot, filename: `page_${index + 1}.png` };
        });

        const imageResults = await Promise.all(imagePromises);
        await browser.close();

        // Create ZIP file
        const archive = archiver('zip', {
            zlib: { level: 6 } // Balanced compression
        });

        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="userReport.zip"');

        // Pipe archive to response
        archive.pipe(res);

        // Add all images to ZIP
        imageResults.forEach(({ buffer, filename }) => {
            archive.append(buffer, { name: filename });
        });

        // Add a README file with report info
        const readme = `
User Report Archive
==================

Generated on: ${new Date().toLocaleString()}
Total Pages: ${imageResults.length}
Date Range: ${startDate} to ${endDate}

Files:
${imageResults.map(({ filename }) => `- ${filename}`).join('\n')}

Note: Images are in PNG format for best quality.
        `;

        archive.append(readme, { name: 'README.txt' });

        // Finalize the archive
        await archive.finalize();

    } catch (err) {
        if (browser) await browser.close();
        console.error("Error during ZIP creation:", err);
        res.status(500).json({
            success: false,
            message: "ZIP generation failed.",
            error: err.message
        });
    }
});

// OPTION 2: Optimized Puppeteer version (if you prefer to stick with it)
/*
const browser = await puppeteer.launch({
    headless: "new",
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding"
    ]
});
*/