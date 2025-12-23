// --- popup.js ---

document.getElementById("submit_hint").addEventListener("click", () => {
    const result = document.getElementById("result");
    const hintType = document.getElementById("hint_type").value;

    // --- 1. Helper Function for Cleaning/Displaying Results ---
    const clearResult = (content, isError = false) => {
        // Simple formatting: Convert newlines to <br> for basic markdown readability
        const formattedContent = isError ? content : content.replace(/\n/g, '<br>');
        
        // Use innerHTML to render the formatted content and the error/loader styles
        result.innerHTML = isError ? 
            `<div class="error-message">${content}</div>` : 
            `<div class="hint-output">${formattedContent}</div>`;
    };
    // -----------------------------------------------------------
    
    // SHOW LOADER immediately
    result.innerHTML = `<div class="loader"></div>`;

    // --- 2. ASYNCHRONOUS DATA FLOW FIX (Using chrome.scripting.executeScript) ---
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        
        // Execute the content script dynamically to get the identifier
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ['content.js'] // The simplified content.js file
            },
            (injectionResults) => {
                
                // Handle error if the script fails to inject or execute
                if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0) {
                    clearResult(`Error: Script failed to inject. Please ensure your manifest.json has "scripting" permission and the tab is correct.`, true);
                    return;
                }
                
                // Retrieve the return value from content.js (it's in injectionResults[0].result)
                const problemIdentifier = injectionResults[0].result || 'Problem details not found';

                if (problemIdentifier === 'Problem details not found') {
                    clearResult("Error: Could not find the problem title on the page.", true);
                    return;
                }
                
                // Get API key from storage (nested to ensure API key is available after identifier)
                chrome.storage.sync.get(['geminiapikey'], ({ geminiapikey }) => {
                    if (!geminiapikey) {
                        clearResult("Error: API Key not set! Please set it in options.", true);
                        return;
                    }

                    // --- 3. PROMPT MAP (Using the correctly fetched identifier) ---
                    const model = "gemini-2.5-flash"; 
                    const promptMap = {
                        Basic_Hint: `You are a concise tutor. Look up the problem details for the challenge titled: "${problemIdentifier}". Provide a single, short, and non-obvious sentence hint for this problem. DO NOT ask questions or include the final answer or solution steps.`,
                        Detailed_Hint: `You are a technical assistant. Look up the problem details for the challenge titled: "${problemIdentifier}". Provide a direct hint (1-2 paragraphs). Identify the main concept/formula and outline the first one or two crucial setup steps. DO NOT ask questions, define terms, or solve the problem completely.`,
                        Final_Hint: `You are an expert solver. Look up the problem details for the challenge titled: "${problemIdentifier}". Provide a complete, detailed, step-by-step solution and guide for this problem. Use a numbered list for the steps and clearly state the final answer.`,
                    }[hintType];


                    // --- 4. API FETCH LOGIC ---
                    (async () => {
                        try {
                            const fetchResponse = await fetch(
                                `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiapikey}`,
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        contents: [{ role: "user", parts: [{ text: promptMap }] }],
                                        generationConfig: { 
                                            temperature: 0.2,
                                            maxOutputTokens: 2048
                                        }
                                    })
                                }
                            );

                            if (!fetchResponse.ok) {
                                const errorText = await fetchResponse.text();
                                throw new Error(`API Error: ${fetchResponse.status} - ${errorText}`);
                            }

                            const data = await fetchResponse.json();
                            const candidate = data.candidates?.[0];

                            if (candidate) {
                                const generatedText = candidate.content?.parts?.[0]?.text;
                                
                                if (generatedText) {
                                    clearResult(generatedText); 
                                    return;
                                } 
                                
                                const finishReason = candidate.finishReason || "UNKNOWN";
                                let errorMessage = `API returned an empty hint. Finish Reason: ${finishReason}.`;
                                if (finishReason === 'SAFETY') errorMessage += " (Content blocked).";
                                if (finishReason === 'MAX_TOKENS') errorMessage += " (Increase maxOutputTokens).";
                                
                                clearResult("Error: " + errorMessage, true);
                                console.error("API Response Data (Empty Text):", data);

                            } else {
                                clearResult("Error: API response contained no content candidates.", true);
                                console.error("API Response Data (No Candidates):", data);
                            }

                        } catch (error) {
                            clearResult(`Error fetching hint: ${error.message}`, true);
                            console.error("Fetch Error:", error);
                        }
                    })();
                    // --- END API FETCH LOGIC ---

                }); // end storage.sync.get
            }
        ); // end executeScript
    }); // end tabs.query
}); // end addEventListener