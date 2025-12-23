function extractProblemIdentifier() {
    
    // 1. PINPOINT SELECTOR (Highly specific to the current LeetCode problem header structure)
    // This targets the text that typically holds the problem number and title
    const verySpecificHeaderSelector = '.flex.items-start h4, .flex.items-start a'; 

    // 2. HIGH PRIORITY FALLBACKS (Based on unique attributes/links)
    const specificLinkSelector = 'a[href*="/problems/"]:not(.no-underline)'; 
    const dataCySelector = '[data-cy="question-title"]'; 

    // 3. GENERAL FALLBACKS 
    const generalHeaderSelector = 'h1, h2';

    // Attempt to find the element using the most reliable and structural selectors first
    const titleElement = document.querySelector(verySpecificHeaderSelector) ||
                         document.querySelector(specificLinkSelector) ||
                         document.querySelector(dataCySelector) ||
                         document.querySelector(generalHeaderSelector);
    
    if (titleElement) {
        // Return the clean text content
        return titleElement.innerText.trim();
    }
    
    // Final fallback
    return document.title.split(' - ')[0].trim() || 'Problem details not found';
}
// The function is executed immediately when injected, and its return value 
// is automatically returned to the calling script in the popup.
extractProblemIdentifier();