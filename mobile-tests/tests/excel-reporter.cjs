const Mocha = require('mocha');
const { EVENT_RUN_END, EVENT_TEST_PASS, EVENT_TEST_FAIL, EVENT_TEST_PENDING } = Mocha.Runner.constants;
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelReporter {
    constructor(runner) {
        this.results = [];
        this.stats = { total: 0, passed: 0, failed: 0, duration: 0 };
        this.startTime = Date.now();

        runner
            .on(EVENT_TEST_PASS, test => {
                this.stats.passed++;
                this.stats.total++;
                this.addResult(test, 'Pass');
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                this.stats.failed++;
                this.stats.total++;
                this.addResult(test, 'Fail', err.message);
            })
            .on(EVENT_RUN_END, async () => {
                this.stats.duration = Date.now() - this.startTime;
                await this.generateExcelReport();
            });
    }

    addResult(test, status, errorMsg = '') {
        const metadata = test.metadata || {};
        this.results.push({
            id: metadata.id || 'N/A',
            module: metadata.module || 'General',
            screen: metadata.screen || 'N/A',
            scenario: metadata.scenario || test.title,
            expected: metadata.expected || 'Scenario completed successfully',
            status: status,
            duration: test.duration || 0,
            error: errorMsg
        });
    }

    async generateExcelReport() {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Appium Test Report');

        // Add Summary Section
        sheet.addRow(['Test Execution Summary']);
        sheet.getRow(1).font = { bold: true, size: 14 };
        sheet.addRow(['Total Tests', this.stats.total]);
        sheet.addRow(['Passed', this.stats.passed]);
        sheet.addRow(['Failed', this.stats.failed]);
        sheet.addRow(['Total Duration', `${(this.stats.duration / 1000).toFixed(2)} seconds`]);
        sheet.addRow([]); // Empty row for spacing

        // Add Header
        const headerRow = sheet.addRow([
            'Test Case ID',
            'Module',
            'Screen Name',
            'Scenario Name',
            'Expected Result',
            'Status',
            'Execution Time (ms)'
        ]);
        
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0070C0' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Add Data
        this.results.forEach(res => {
            const row = sheet.addRow([
                res.id,
                res.module,
                res.screen,
                res.scenario,
                res.expected,
                res.status,
                res.duration
            ]);

            const statusCell = row.getCell(6);
            if (res.status === 'Pass') {
                statusCell.font = { color: { argb: 'FF00B050' }, bold: true };
            } else if (res.status === 'Fail') {
                statusCell.font = { color: { argb: 'FFFF0000' }, bold: true };
            }
        });

        sheet.columns.forEach(column => {
            column.width = 25;
        });

        // Ensure directory exists
        const reportsDir = path.join(process.cwd(), 'mobile-tests', 'reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const reportPath = path.join(reportsDir, 'AppiumTestReport.xlsx');
        await workbook.xlsx.writeFile(reportPath);
        console.log(`\nTest report generated successfully at: ${reportPath}`);
    }
}

module.exports = ExcelReporter;
