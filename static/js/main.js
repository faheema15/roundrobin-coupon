async function claimCoupon() {
    const button = document.getElementById('claimButton');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    button.disabled = true;
    loading.classList.remove('d-none');
    result.classList.add('d-none');

    try {
        const response = await fetch('/claim-coupon', {
            method: 'POST'
        });

        console.log('Raw response:', response); // 👈 See if fetch worked

        const data = await response.json();

        console.log('Parsed data:', data); // 👈 See the actual response JSON
        console.log('Was it successful?', data.success); // 👈 Check if success is true/false
        console.log('What is the message?', data.message); // 👈 See message string

        if (data.success) {
            const couponCode = data.message.split(': ')[1] || data.message;
            console.log('Coupon Code:', couponCode); // 👈 What is the coupon code

            result.innerHTML = `
            <div class="d-flex align-items-center justify-content-center gap-2">
                <span>Successfully claimed coupon:</span>
                <code class="bg-dark px-2 py-1 rounded">${couponCode}</code>
                <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('${couponCode}', event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                </button>
            </div>
        
            `;

            result.classList.remove('d-none', 'alert-danger');
            result.classList.add('alert-success');
        } else {
            result.classList.remove('d-none', 'alert-success');
            result.classList.add('alert-danger');
            result.textContent = data.message;
        }
    } catch (error) {
        console.error('Error claiming coupon:', error); // 👈 Catches fetch errors
        result.classList.remove('d-none', 'alert-success');
        result.classList.add('alert-danger');
        result.textContent = 'An error occurred while claiming the coupon.';
    }

    loading.classList.add('d-none');
    button.disabled = false;
}

function copyToClipboard(text, event) {
    navigator.clipboard.writeText(text)
        .then(() => {
            if (event && event.target) {
                const button = event.target;

                // Change icon to check
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                      <path d="M13.485 1.929a1.5 1.5 0 0 1 2.121 2.122l-9 9a1.5 1.5 0 0 1-2.122 0l-5-5a1.5 1.5 0 1 1 2.122-2.122L6 9.879l7.485-7.95z"/>
                    </svg>
                `;

                button.disabled = true;

                // After 2 seconds, change back to clipboard icon and re-enable button
                setTimeout(() => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                        </svg>
                    `;

                    button.disabled = false;
                }, 2000);
            }
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}
