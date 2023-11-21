const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Function to process an SVG file
function processSvgFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const svg = document.querySelector('svg');
    const path = svg.querySelector('.st0');

    // Check if the file is an SVG and has the required path
    if (!svg || !path) {
        return null;
    }

    return {
        fileName: filePath,
        viewBox: svg.getAttribute('viewBox'),
        d: path.getAttribute('d')
    };
}

// Main function to process the directory
function processDirectory(dir) {
    const results = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isFile() && path.extname(file) === '.svg') {
            const result = processSvgFile(filePath);
            if (result) {
                results.push(result);
            } else {
                console.log(`Skipping non-SVG or non-conforming file: ${file}`);
            }
        }
    });

    // Write results to a JSON file
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
}

// Get the directory from the command line arguments
const directory = process.argv[2];
if (!directory) {
    console.error('Please specify a directory');
    process.exit(1);
}

// Call the main function
processDirectory(directory);
