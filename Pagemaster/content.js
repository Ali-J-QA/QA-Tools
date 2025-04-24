function injectScriptFile(filePath) {
    try {
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL(filePath);
        script.type = "text/javascript";

        script.onload = () => {
            console.log("Injected script file:", filePath);
            script.remove();
        };

        script.onerror = () => {
            console.error("Failed to load script file:", filePath);
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                (document.head || document.documentElement).appendChild(script);
            });
        } else {
            (document.head || document.documentElement).appendChild(script);
        }
    } catch (error) {
        console.error("Error injecting script file:", error);
    }
}

injectScriptFile("injected.js");
