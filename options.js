document.addEventListener("DOMContentLoaded",()=>{
    chrome.storage.sync.get(['geminiapikey'],({geminiapikey})=>{
        if(geminiapikey) document.getElementById("api_key").value=geminiapikey;
    });
    document.getElementById("save").addEventListener("click",()=>{
        const apikey = document.getElementById("api_key").value.trim();
        if(!apikey) return ;
        
        chrome.storage.sync.set({geminiapikey:apikey},()=>{
            const status = document.getElementById("status");
            status.textContent = "API Key saved!";  
            status.style.display = "block";

            
        });
        });
});                  