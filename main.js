const centralSearchInput = document.getElementById('central-search-input');
const topUrlInput = document.getElementById('url-input');
const viewport = document.getElementById('browser-viewport');
const welcomeScreen = document.getElementById('welcome-screen');
const backBtn = document.getElementById('back');
const forwardBtn = document.getElementById('forward');
const refreshBtn = document.getElementById('refresh');

// ==========================================
// CORE NAVIGATION
// ==========================================

function loadURL(query) {
    let url = query.trim();
    if (url === "") return;

    if (!welcomeScreen.classList.contains('fade-out')) {
        welcomeScreen.classList.add('fade-out');
        setTimeout(() => { welcomeScreen.style.display = 'none'; }, 400); 
    }

    if (!url.startsWith('http')) {
        if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
        } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
    }
    viewport.setAttribute('src', url);
}

// ==========================================
// UI HACKING: DOM INJECTION
// ==========================================

viewport.addEventListener('dom-ready', () => {
    const currentUrl = viewport.getURL();
    
    if (currentUrl.includes('google.com/search')) {
        const injectCSS = `
            html, body, #viewport, #doc-info, .main { background: transparent !important; }
            #searchform, #appbar, .RNNXgb, .tF2Cxc, .g, #cnt, .s6JM6d {
                background: rgba(10, 12, 16, 0.75) !important;
                border: 1px solid rgba(255,255,255,0.05) !important;
                border-radius: 12px !important;
                backdrop-filter: blur(10px) !important;
                box-shadow: none !important;
            }
            h3, span, em, cite, div, p { color: #e0e7ff !important; text-shadow: none !important; }
            a h3 { color: #818cf8 !important; }
            
            /* Logo replacement fix */
            .logo img, #logo img, .jfN4p, .k1zIA { display: none !important; }
            .logo::after, #logo::after {
                content: "NEXUS" !important;
                color: #818cf8 !important;
                font-size: 28px !important;
                font-weight: 900 !important;
                margin-left: 10px !important;
                text-shadow: 0 0 15px rgba(129, 140, 248, 0.6) !important;
            }
        `;
        viewport.insertCSS(injectCSS);
    }
});

// ==========================================
// EVENT LISTENERS
// ==========================================

viewport.addEventListener('did-navigate', (e) => {
    if (e.url === 'about:blank') {
        welcomeScreen.style.display = 'flex';
        welcomeScreen.classList.remove('fade-out');
        topUrlInput.value = 'nexus://welcome';
    } else {
        const urlObj = new URL(e.url);
        if (urlObj.hostname.includes('google.com')) {
            const q = urlObj.searchParams.get('q');
            topUrlInput.value = q ? `nexus://search - ${decodeURIComponent(q)}` : e.url;
        } else {
            topUrlInput.value = e.url;
        }
    }
});

centralSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadURL(centralSearchInput.value); });
topUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadURL(topUrlInput.value); });

// Back & Forward Fix
backBtn.addEventListener('click', () => { 
    if (viewport.canGoBack()) {
        viewport.goBack(); 
    } else {
        viewport.src = 'about:blank'; 
    }
});

forwardBtn.addEventListener('click', () => { 
    if (viewport.canGoForward()) {
        viewport.goForward(); 
    }
});

refreshBtn.addEventListener('click', () => { viewport.reload(); });