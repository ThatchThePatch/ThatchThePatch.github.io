const codeReader = new ZXing.BrowserMultiFormatReader();
const videoElement = document.getElementById('video');
const isbnDisplay = document.getElementById('isbn');
const resultsDiv = document.getElementById('results');
const bookDetailsDiv = document.getElementById('book-details');
const scanAgainBtn = document.getElementById('scan-again-btn');
const loadingDiv = document.getElementById('loading');

let scanning = true;
let backCamDeviceId = null;  // Global variable to remember the back camera

// Request camera permission and start scanning
function requestCameraPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        isbnDisplay.textContent = 'Camera not supported on this device/browser.';
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
        .then(stream => {
            const track = stream.getVideoTracks()[0];
            backCamDeviceId = track.getSettings().deviceId;
            stream.getTracks().forEach(track => track.stop());

            startScanner(backCamDeviceId);
        })
        .catch(error => {
            console.error("Back camera not available, falling back to default.");
            listVideoDevices();
        });
}

// List available video devices and start scanning with the first one
function listVideoDevices() {
    codeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
            const firstDeviceId = videoInputDevices[0]?.deviceId;
            if (firstDeviceId) {
                backCamDeviceId = firstDeviceId;
                startScanner(firstDeviceId);
            } else {
                isbnDisplay.textContent = 'No camera found';
            }
        })
        .catch(err => {
            console.error(err);
            isbnDisplay.textContent = 'Error accessing camera';
        });
}

// Start the scanner on a given deviceId
function startScanner(deviceId) {
    codeReader.decodeFromVideoDevice(deviceId, videoElement, (result, err) => {
        if (result && scanning) {
            scanning = false;
            const isbn = result.getText();
            isbnDisplay.textContent = `ISBN: ${isbn}`;
            getBookTitle(isbn);
            codeReader.reset();  // stop scanning
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
        }
    });
}

// Show loading spinner
function showLoading() {
    loadingDiv.style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    loadingDiv.style.display = 'none';
}

// Fetch book details by ISBN from OpenLibrary API
function getBookTitle(isbn) {
    showLoading();

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
                listBook(fullTitle);
            } else {
                bookDetailsDiv.innerHTML = `<p>No details found for ISBN: ${isbn}</p>`;
                resultsDiv.style.display = 'block';
                hideLoading();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoading();
        });
}

// Fetch book info from Libgen via AllOrigins
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
            resultsDiv.style.display = 'block';
            hideLoading();
        });
}

// Scan Again function — to restart scanning
function scanAgain() {
    resultsDiv.style.display = 'none';
    isbnDisplay.textContent = 'Waiting for scan...';
    scanning = true;

    if (backCamDeviceId) {
        startScanner(backCamDeviceId);
    } else {
        codeReader.listVideoInputDevices()
            .then(videoInputDevices => {
                const firstDeviceId = videoInputDevices[0]?.deviceId;
                if (firstDeviceId) {
                    startScanner(firstDeviceId);
                } else {
                    isbnDisplay.textContent = 'No camera available';
                }
            })
            .catch(err => {
                console.error('Error listing video devices:', err);
                isbnDisplay.textContent = 'Error accessing camera';
            });
    }
}

// Attach Scan Again button event listener
scanAgainBtn.addEventListener('click', scanAgain);

// Initialize on page load
requestCameraPermission();
