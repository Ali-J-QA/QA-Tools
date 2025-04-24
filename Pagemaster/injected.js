// Function to sanitize filenames
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
}

// Function to generate the XPath for an element
function getXPath(element) {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }
    const components = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let index = 0;
        let sibling = element.previousSibling;
        while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === element.nodeName) {
                index++;
            }
            sibling = sibling.previousSibling;
        }
        const tagName = element.nodeName.toLowerCase();
        const pathIndex = index ? `[${index + 1}]` : "";
        components.unshift(`${tagName}${pathIndex}`);
        element = element.parentNode;
    }
    return components.length ? `/${components.join("/")}` : null;
}

// Function to download file
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFilename(filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Function to download data as a CSV file
function downloadCSV(data, filename) {
    const csvHeader = ["Label", "Type", "Link Endpoint", "XPath"];
    const csvContent = [
        csvHeader.join(","),
        ...data.map((row) => csvHeader.map(header => `"${(row[header] || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    downloadFile(csvContent, filename, "text/csv");
}

// Main analysis function
function analyzePage(generateCSV = true) {
    console.log("🔍 Running analyzePage. CSV export:", generateCSV);

    const elements = document.querySelectorAll(
        `a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]`
    );

    const data = Array.from(elements).map((el) => {
        const label = el.textContent.trim() ||
                      el.getAttribute("aria-label") ||
                      el.getAttribute("title") ||
                      el.getAttribute("alt") ||
                      "N/A";
        const type = el.tagName.toLowerCase();

        let linkEndpoint = "N/A";
        if (type === "a") {
            linkEndpoint = el.getAttribute("href") || el.href || "N/A";
        } else if (type === "form") {
            linkEndpoint = el.getAttribute("action") || "N/A";
        } else if (type === "img") {
            linkEndpoint = el.getAttribute("src") || "N/A";
        }

        return {
            "Label": label,
            "Type": type,
            "Link Endpoint": linkEndpoint,
            "XPath": getXPath(el)
        };
    });

    if (generateCSV) {
        const url = window.location.hostname + window.location.pathname.replace(/\//g, "_");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
        const filename = `${url}_${timestamp}.csv`;
        downloadCSV(data, filename);
        console.log(`✅ CSV generated: ${filename}`);
    }
}

// Attach to window
window.analyzePage = analyzePage;

// Message listener
window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "ANALYZE_PAGE") {
        analyzePage(event.data.generateCSV);
    }
});

console.log("✅ injected.js loaded");
