async function setUpPage() {
    await loadPlayerHistoryContent();
    await loadStaffHistoryContent();
    await loadBannersContent();
    
    const btns = document.querySelectorAll('.nav-bar-btn');
    btns.forEach(btn => btn.disabled = true);

    const loadingScreen = document.querySelector('#loading-screen');
    loadingScreen.style.animation = fadeOut;

    await sleep(600);
    loadingScreen.style.display = 'none';
    document.body.style.overflowY = 'auto';
    await displayPlayerHistory();

    btns.forEach(btn => btn.disabled = false);
}

window.onload = () => setUpPage();