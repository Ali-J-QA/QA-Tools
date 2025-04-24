document.getElementById("analyze-page").addEventListener("click", () => {
    const generateCSV = document.getElementById("output-csv").checked;

    document.getElementById("status").textContent = "Analyzing page...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                func: (generateCSV) => {
                    window.postMessage(
                        {
                            type: "ANALYZE_PAGE",
                            generateCSV: generateCSV,
                        },
                        "*"
                    );
                },
                args: [generateCSV],
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error("Error executing script:", chrome.runtime.lastError.message);
                    document.getElementById("status").textContent = "❌ Error analyzing page.";
                } else {
                    document.getElementById("status").textContent = "✅ Page analysis triggered.";
                }
            }
        );
    });
});
