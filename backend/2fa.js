document.getElementById('generateOTP').addEventListener('click', function() {
    fetch('/generate-otp', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('otpInfo').style.display = 'block';
        document.getElementById('qrCode').src = data.qrCode;
        document.getElementById('secret').textContent = `Secret key for manual setup: ${data.secret}`;
    })
    .catch(error => console.error('Error:', error));
});
