const codeReader = new ZXing.BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const isbnDisplay = document.getElementById('isbn');
const resultsDiv = document.getElementById('results');
const bookDetailsDiv = document.getElementById('book-details');
const scanAgainBtn = document.getElementById('scan-again-btn');
const loadingDiv = document.getElementById('loading');

let scanning = true;

codeReader
    .listVideoInputDevices()
    .then(videoInputDevices => {
        const firstDeviceId = videoInputDevices[0]?.deviceId;
        if (firstDeviceId) {
            startScanner(firstDeviceId);
        } else {
            isbnDisplay.textContent = 'No camera found';
        }
    })
    .catch(err => {
        console.error(err);
        isbnDisplay.textContent = 'Error accessing camera';
    });

// Start the scanner
function startScanner(deviceId) {
    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
        if (result && scanning) {
            scanning = false;
            const isbn = result.getText();
            isbnDisplay.textContent = `ISBN: ${isbn}`;
            getBookTitle(isbn);
            codeReader.reset();  // Stop scanning
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
        }
    });
}

// Show the loading indicator
function showLoading() {
    loadingDiv.style.display = 'block';
}

// Hide the loading indicator
function hideLoading() {
    loadingDiv.style.display = 'none';
}

// Fetch book details by ISBN
function getBookTitle(isbn) {
    showLoading();  // Show loader when fetching book info

    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const key = `ISBN:${isbn}`;
            const book = data[key];

            if (book) {
                const title = book.title;
                const subtitle = book.subtitle ? `: ${book.subtitle}` : '';
                const fullTitle = title + subtitle;
                listBook(fullTitle);  // Fetch book details from Libgen
            } else {
                bookDetailsDiv.innerHTML = `<p>No details found for ISBN: ${isbn}</p>`;
                resultsDiv.style.display = 'block';  // Show results popup
                hideLoading();  // Hide loader if no book found
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoading();
        });
}

// Fetch book info from Libgen
function listBook(query) {
    fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(`https://libgen.rs/search.php?req=${query.replace(/ /g, "+")}`))
        .then(response => response.json())
        .then(data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data.contents, "text/html");

            let output = '';
            for (let i = 2; i < 7; i++) {
                let nodesSnapshotB = doc.evaluate(`/html/body/table[3]/tbody/tr[${i}]/td[3]//*[@title]`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                let nodesSnapshotA = doc.evaluate(`/html/body/table[3]/tbody/tr[${i}]/td[2]`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                let nodesSnapshotL = doc.evaluate(`/html/body/table[3]/tbody/tr[${i}]/td[3]//*[@title]/@href`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                if (nodesSnapshotB.snapshotLength && nodesSnapshotA.snapshotLength && nodesSnapshotL.snapshotLength) {
                    let bookTitle = nodesSnapshotB.snapshotItem(0).textContent.trim();
                    let author = nodesSnapshotA.snapshotItem(0).textContent.trim();
                    let link = 'https://libgen.rs/' + nodesSnapshotL.snapshotItem(0).textContent.trim();

                    output += `<p><strong>${bookTitle}</strong> by ${author}<br><a href="${link}" target="_blank">Download</a></p>`;
                }
            }

            bookDetailsDiv.innerHTML = output || '<p>No matching books found on Libgen.</p>';
            resultsDiv.style.display = 'block';  // Show results
            hideLoading();  // Hide loader when results are ready
        });
}

// Scan Again button handler
scanAgainBtn.addEventListener('click', () => {
    resultsDiv.style.display = 'none';  // Hide results popup
    isbnDisplay.textContent = 'Waiting for scan...';  // Reset display
    scanning = true;  // Resume scanning

    codeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
            const firstDeviceId = videoInputDevices[0]?.deviceId;
            if (firstDeviceId) {
                startScanner(firstDeviceId);  // Restart scanner
            }
        });
});
