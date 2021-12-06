// Animations
const fadeIn = 'fadeIn 1.2s forwards';
const fadeInUp = 'fadeInUp 1.2s forwards';
const fadeInRight = 'fadeInRight 1.2s forwards';
const fadeInDown = 'fadeInDown 1.2s forwards';
const fadeInLeft = 'fadeInLeft 1.2s forwards';
const fadeOut = 'fadeOut 0.6s forwards';
const fadeOutUp = 'fadeOutUp 1.2s forwards';

async function displayPlayerHistory() {
    const content = document.querySelector('#player-history');
    const contentChildren = [];
    content.childNodes.forEach(child => {
        if (child.nodeName !== '#text') contentChildren.push(child);
    });

    for (let i = 0; i < contentChildren.length; i++) {
        if (i < 3) {
            await sleep(120);
            contentChildren[i].style.animation = fadeInUp;
        }

        // Animates the tournament divs
        if (i == 3) {
            var tournaments = contentChildren[i].childNodes;

            for (let j = 0; j < tournaments.length; j++) {
                await sleep(120);
                displayTournamentPlayed(tournaments[j]);
            }
        }
    }
}

async function displayTournamentPlayed(tournamentDiv) {
    tournamentDiv.style.animation = fadeInUp;

    var header = tournamentDiv.childNodes[0];
    var info = tournamentDiv.childNodes[1];
    var team = tournamentDiv.childNodes[3];

    // Animates the "header" class div
    await sleep(45);
    header.childNodes[0].style.animation = fadeInLeft;
    await sleep(30);
    header.childNodes[1].style.animation = fadeInRight;

    // Animates the "info" class div
    await sleep(50);
    for (let j = 0; j < info.childNodes.length; j++) {
        await sleep(45);
        info.childNodes[j].style.animation = fadeInDown;
    }

    // Animates the "team" class div
    if (team) {
        team.childNodes[0].style.animation = fadeInLeft;

        var teammates = team.childNodes[1];
        for (let j = 0; j < teammates.childNodes.length; j++) {
            await sleep(70);
            teammates.childNodes[j].childNodes[0].style.animation = fadeInDown;
            teammates.childNodes[j].childNodes[1].style.animation = fadeInUp;
        }
    }
}

async function displayStaffHistory() {
    const content = document.querySelector('#staff-history');
    const contentChildren = [];
    content.childNodes.forEach(child => {
        if (child.nodeName !== '#text') contentChildren.push(child);
    });

    for (let i = 0; i < contentChildren.length; i++) {
        if (i < 3) {
            await sleep(120);
            contentChildren[i].style.animation = fadeInUp;
        }

        // Animates the tournament divs
        if (i == 3) {
            var tournaments = contentChildren[i].childNodes;

            for (let j = 0; j < tournaments.length; j++) {
                await sleep(120);
                displayTournamentStaffed(tournaments[j]);
            }
        }
    }
}

async function displayTournamentStaffed(tournamentDiv) {
    tournamentDiv.style.animation = fadeInUp;

    var header = tournamentDiv.childNodes[0];
    var roles = tournamentDiv.childNodes[2];

    // Animates the "header" class div
    await sleep(45);
    header.childNodes[0].style.animation = fadeInLeft;
    await sleep(30);
    header.childNodes[1].style.animation = fadeInRight;
    await sleep(30);
    header.childNodes[2].style.animation = fadeInRight;

    // Animates the "roles" class div
    await sleep(100);
    for (let j = 0; j < roles.childNodes.length; j++) {
        await sleep(45);
        roles.childNodes[j].style.animation = fadeInUp;
    }
}

async function displayBanners() {
    const content = document.querySelector('#banners');
    const contentChildren = [];
    content.childNodes.forEach(child => {
        if (child.nodeName !== '#text' && child.nodeName !== 'div') contentChildren.push(child);
    });

    if (!document.querySelector('.bricklayer-column-sizer')) {
        // Uses bricklayer library for the layout
        new Bricklayer(document.querySelector('#player-banners'));
        new Bricklayer(document.querySelector('#staff-banners'));
    }

    for (let i = 0; i < contentChildren.length; i++) {
        await sleep(120);
        contentChildren[i].style.animation = fadeInUp;

        // Animates the each banner
        if (contentChildren[i].classList.value.includes('bricklayer')) {
            await sleep(120);
            await animateBanners(contentChildren[i].id);
        }
    }
}

async function animateBanners(divId) {
    const bannerType = (divId == 'player-banners') ? 'player-banner' : 'staff-banner';
    const banners = document.querySelectorAll(`.${bannerType}`);

    for (let i = 0; i < banners.length; i++) {
        banners[i].style.animation = fadeInUp;
        await sleep(20);
    }
}