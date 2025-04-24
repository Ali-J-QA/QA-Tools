// Function to sanitize filenames
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
}

// Function to download file
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const sanitizeFilename = sanitizeFilename(filename);
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Function to download data as a CSV file
function downloadCSV(data, filename) {
    const csvContent = [
        ["Label", "Type", "Link Endpoint", "XPath"],
        ...data.map((row) => [row.label, row.type, row.linkEndpoint, row.xpath])
    ]
        .map((e) => e.join(","))
        .join("\n");

    downloadFile(csvContent, filename, "text/csv");
}

// Extract interactive elements 
function getInteractiveElements() {
    const elements = document.querySelectorAll(
        `a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]`
    );
    const result = [];
    elements.forEach((element) => {
        const label =
            element.textContent.trim() || 
            element.getAttribute("aria-label") ||
            element.getAttribute("title") ||
            "N/A";
        const type = element.tagName.toLowerCase();
        const linkEndpoint = element.tagName.toLowerCase() === "a" ? element.getAttribute("href") || "" : "";
        const xpath = getXPath(element);
        result.push({ label, type, linkEndpoint, xpath});
    });
    return result;
}

// Function to generate the XPath for an element
function getXPath(element) {
    const components = [];
    while (element) {
        let siblingIndex = 1;
        let sibling = element.previousSibling;
        while(sibling) {
            if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
                siblingIndex++;
            }
            sibling = sibling.previousSibling;
        }
        components.unshift(`${element.nodeName.toLowerCase()}[${siblingIndex}]`);
        element = element.parentNode;
    }
    return `/${components.join("/")}`;
}

// Main logic
function analyzePage(generateCSV = true) {
    const url = window.location.hostname + window.location.pathname.replace(/\//g, "_");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    const fileName = `${url}_${timestamp}.csv`;
}

// Attach the analyzePage function to the window object
window.analyzePage = analyzePage;