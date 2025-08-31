// Main script - exactly like the original cratedigger but with Mark's data
const cratedigger = new Cratedigger();

// DOM elements
const bottomBar = document.getElementById('bottom-bar');
const buttonPrev = document.getElementById('button-prev');
const buttonShow = document.getElementById('button-show');
const buttonNext = document.getElementById('button-next');
const titleContainer = document.getElementById('cratedigger-record-title');
const artistContainer = document.getElementById('cratedigger-record-artist');
const coverContainer = document.getElementById('cratedigger-record-cover');

// CSV parsing function
function parseCSV(csvText) {
    const lines = csvText.split('\\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing (handles basic cases)
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '\"' && (j === 0 || line[j-1] === ',')) {
                inQuotes = true;
            } else if (char === '\"' && inQuotes) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
        // Create record object
        const record = {};
        headers.forEach((header, index) => {
            if (values[index]) {
                record[header.replace(/\"/g, '')] = values[index].replace(/\"/g, '');
            }
        });
        
        // Map fields to expected format
        const mappedRecord = {
            title: record.title || record['song title'] || 'Unknown Title',
            artist: record.artist || 'Unknown Artist',
            cover: record.imageurl || record['imageurl'] || record.cover || '',
            year: record.year || '',
            id: `RECORD_${i}`,
            hasSleeve: false,
            genre: record.genre || record['song genre'] || '',
            label: record.label || record['artistic category'] || ''
        };
        
        records.push(mappedRecord);
    }
    
    return records;
}

// Load CSV data
async function loadMarksCollection() {
    try {
        const response = await fetch('MUSIC COLLECTION PERSONA-Grid view.csv');
        if (!response.ok) {
            throw new Error('Could not load CSV file');
        }
        const csvText = await response.text();
        const recordsData = parseCSV(csvText);
        
        console.log(`Loaded ${recordsData.length} records from CSV`);
        console.log('Sample record:', recordsData[0]);
        
        cratedigger.loadRecords(recordsData, true, () => {
            bindEvents();
            console.log('Records loaded and events bound');
        });
        
    } catch (error) {
        console.error('Error loading Mark\\'s collection:', error);
        
        // Fallback: try to load sample data
        const sampleData = [
            {
                title: \"Sample Record 1\",
                artist: \"Sample Artist\",
                cover: \"https://via.placeholder.com/400x400/333/fff?text=Sample+1\",
                year: \"2023\",
                id: \"SAMPLE_1\",
                hasSleeve: false
            },
            {
                title: \"Sample Record 2\", 
                artist: \"Another Artist\",
                cover: \"https://via.placeholder.com/400x400/444/fff?text=Sample+2\",
                year: \"2023\",
                id: \"SAMPLE_2\",
                hasSleeve: false
            }
        ];
        
        cratedigger.loadRecords(sampleData, false, () => {
            bindEvents();
            console.log('Fallback sample data loaded');
        });
    }
}

// Bind button events - exactly like original
function bindEvents() {
    buttonPrev.addEventListener('click', (e) => {
        e.preventDefault();
        cratedigger.selectPrevRecord();
    }, false);

    buttonShow.addEventListener('click', (e) => {
        e.preventDefault();
        if (cratedigger.getSelectedRecord()) {
            cratedigger.flipSelectedRecord();
        } else {
            cratedigger.selectNextRecord();
        }
    }, false);

    buttonNext.addEventListener('click', (e) => {
        e.preventDefault();
        cratedigger.selectNextRecord();
    }, false);
}

// Fill info panel - exactly like original
function fillInfoPanel(record) {
    if (record.data.title) {
        titleContainer.innerHTML = record.data.title;
    }

    if (record.data.artist) {
        artistContainer.innerHTML = record.data.artist;
    }

    if (record.data.cover) {
        coverContainer.style.backgroundImage = 'url(' + record.data.cover + ')';
    }
}

// Initialize cratedigger - exactly like original
cratedigger.init({
    debug: false,
    elements: {
        rootContainer: document.getElementById('cratedigger'),
        canvasContainer: document.getElementById('cratedigger-canvas'),
        loadingContainer: document.getElementById('cratedigger-loading'),
        infoContainer: document.getElementById('cratedigger-info'),
    },
    onInfoPanelOpened() {
        bottomBar.classList.add('closed');
        const selectedRecord = cratedigger.getSelectedRecord();
        if (selectedRecord) {
            fillInfoPanel(selectedRecord);
        }
    },

    onInfoPanelClosed() {
        bottomBar.classList.remove('closed');
    },
});

// Load Mark's collection
loadMarksCollection();