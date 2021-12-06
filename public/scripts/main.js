const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function changePage(e) {
    if (!isNaN(e)) {
        showLessOptions();
        const option = document.querySelector(`#option-${e}`);
        option.childNodes[1].click();
        return;
    }

    const parent = e.target.parentElement;
    if (parent.classList.value.includes('selected')) return;

    // Disable all buttons temporarily
    const btns = document.querySelectorAll('.nav-bar-btn');
    btns.forEach(btn => btn.disabled = true);

    // Buttons
    document.querySelector('.selected').classList.remove('selected');   
    parent.classList.add('selected');

    if (e.target.innerHTML == 'Player History') {
        var contentId = 'player-history';
    } else if (e.target.innerHTML == 'Staff History') {
        var contentId = 'staff-history';
    } else {
        var contentId = 'banners';
    }

    // Animates current content out
    var currentContent = document.querySelector('.shown');
    currentContent.style.animation = fadeOut;
    await sleep(600);

    // Hides current content
    currentContent.classList.remove('shown');
    currentContent.classList.add('hidden');

    // Brings user to top of the page
    window.scrollTo(0, 0);

    // Removes entrance animations
    document.querySelectorAll('.animated-element').forEach(el => el.style.animation = '');

    // Loads page
    var newContent = document.querySelector(`#${contentId}`);
    newContent.classList.remove('hidden');
    newContent.classList.add('shown');

    // Removes fade out animation
    newContent.style.animation = '';

    // Display the content
    if (contentId == 'player-history') {
        await displayPlayerHistory();
    } else if (contentId == 'staff-history') {
        await displayStaffHistory();
    } else {
        await displayBanners();
    }

    // Re-enable buttons
    btns.forEach(btn => btn.disabled = false);
}

function showMoreOptions() {
    const navBar = document.querySelector('#nav-bar');
    const responsiveNavBar = document.querySelector('#responsive-nav-bar');

    navBar.style.display = 'none';
    responsiveNavBar.style.display = 'grid';

    const content = document.querySelector('#content');
    content.setAttribute('onclick', 'showLessOptions()');
}

function showLessOptions() {
    const navBar = document.querySelector('#nav-bar');
    const responsiveNavBar = document.querySelector('#responsive-nav-bar');

    navBar.style.display = 'grid';
    responsiveNavBar.style.display = 'none';

    const content = document.querySelector('#content');
    content.removeAttribute('onclick');

    responsiveNavBar.childNodes.forEach(child => {
        if (child.nodeName !== '#text') child.classList.remove('selected');
    });
}

// Detects arrow keys or scroll wheel
document.onkeydown = e => {
    const key = e.key;

    if (document.querySelector('#image-container-1')) {
        if (key == 'ArrowLeft' || key == 'ArrowDown') changeImage('Previous');
        else if (key == 'ArrowRight' || key == 'ArrowUp') changeImage('Next');
    }

    if (document.querySelector('#overlay')) {
        const overlay = document.querySelector('#overlay');

        if (key == 'Escape' && overlay.hasAttribute('onclick')) overlay.click();
    }
}

window.addEventListener('wheel', e => {
    if (!document.querySelector('#image-container-1')) return;
    const wDelta = e.deltaY > 0 ? 'down' : 'up';

    if (wDelta == 'down') changeImage('Previous');
    else changeImage('Next');
});