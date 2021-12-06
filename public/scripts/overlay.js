function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.prepend(overlay);

    const exitBtn = document.createElement('button');
    exitBtn.classList.add('exit-btn');
    exitBtn.setAttribute('onclick', 'overlay.click()');
    overlay.appendChild(exitBtn);

    return overlay;
}

function createGridElements(textNodes, grid, divClasses) {
    textNodes.forEach(textNode => grid.appendChild(createDiv(divClasses, textNode)));
}

async function hideOverlay(e) {
    const target = e.target;

    if (target.id == 'overlay') {
        const overlay = document.querySelector('#overlay');
        overlay.childNodes[1].style.animation = fadeOutUp;
        overlay.style.animation = fadeOut;
        await sleep(600);

        document.body.removeChild(overlay);
        document.body.style.overflowY = 'auto';
    }
}

async function displayAboutSection() {
    const overlay = createOverlay();
    const about = document.querySelector('#about-section-content');
    const aboutSectionContainer = about.cloneNode(true);
    aboutSectionContainer.id = 'about-section-container';
    aboutSectionContainer.classList.add('overlay-container');
    aboutSectionContainer.style.display = 'inline-block';
    overlay.appendChild(aboutSectionContainer);

    document.body.style.overflow = 'hidden';

    // Entrance animations
    const children = aboutSectionContainer.childNodes;

    await sleep(250);
    for (let i = 2; i < children.length; i++) {
        if (children[i].nodeName !== '#text') {
            if (children[i].localName == 'h2') {
                await sleep(120);
                children[i].style.animation = fadeInDown;
            } else {
                await sleep(60);
                children[i].style.animation = fadeInUp;
            }
        }
    }

    await sleep(600);
    overlay.setAttribute('onclick', 'hideOverlay(event)');
}

async function displayMatchHistory(index) {
    const matches = playerHistory[index].matches;

    // Creates the container in which the match history will be displayed
    const overlay = createOverlay();
    const matchHistoryContainer = createDiv(['overlay-container']);
    matchHistoryContainer.id = 'match-history-container';
    overlay.appendChild(matchHistoryContainer);

    document.body.style.overflow = 'hidden';

    const header = createDiv(['header']);
    const h1 = document.createElement('h1');
    h1.append(document.createTextNode(`${playerHistory[index].info.acronym} Match History`));
    header.appendChild(h1);
    matchHistoryContainer.appendChild(header);

    // Displays stats
    const stats = createDiv(['stats']);
    matchHistoryContainer.appendChild(stats);

    createGridElements(['Total Matches', 'Matches Won', 'Matches Lost', 'Forfeits'], stats, ['head']);

    const totalMatches = matches.length;
    const matchesWon = (matches.filter(match => match.outcome == 0).length).toString();
    const matchesLost = (matches.filter(match => match.outcome == 1).length).toString();
    const forfeits = (matches.filter(match => match.outcome > 1).length).toString();
    createGridElements([totalMatches, matchesWon, matchesLost, forfeits], stats, ['element']);

    // Displays border
    const border = createDiv(['border']);
    matchHistoryContainer.appendChild(border);

    // Displays the actual match history
    const matchHistory = createDiv(['match-history']);
    matchHistoryContainer.appendChild(matchHistory);

    if (playerHistory[index].info.isTeamTournament) {
        matches.forEach(match => {
            var opponent = match.opponent;

            var matchDiv = createDiv(['match']);
            var stage = createDiv(['stage'], match.stage);
            var team = createDiv(['team']);

            var teamName = createDiv(['team-name'], opponent.teamName);
            var players = createDiv(['players']);
            opponent.players.forEach((player, index) => {
                var playerSpan = document.createElement('span');
                playerSpan.classList.add('player-in-team');

                var countryFlag = document.createElement('img');
                countryFlag.setAttribute('src', `https://assets.ppy.sh/old-flags/${player.country}.png`);

                var profileLink = document.createElement('a');
                profileLink.setAttribute('href', `https://osu.ppy.sh/users/${player.userId}`);
                profileLink.setAttribute('target', '_blank');
                profileLink.append(document.createTextNode(player.username));

                appendChildren(playerSpan, [countryFlag, profileLink]);
                players.appendChild(playerSpan);

                if (index !== opponent.players.length - 1) {
                    var separator = document.createElement('span');
                    separator.classList.add('separator');
                    separator.append(document.createTextNode('|'));
                    players.appendChild(separator);
                }
            });

            appendChildren(team, [teamName, players]);

            var results = createDiv(['results'], `${match.winnerScore} - ${match.loserScore}`);
            if (match.outcome == 0) results.classList.add('match-won');
            else if (match.outcome == 1) results.classList.add('match-lost');
            else results.classList.add('match-forfeited');

            appendChildren(matchDiv, [stage, team, results]);

            if (match.mpLink !== '-') {
                var mpLobby = createDiv(['mp-lobby']);

                var mpLink = document.createElement('a');
                mpLink.setAttribute('href', match.mpLink);
                mpLink.setAttribute('target', '_blank');
                mpLink.append(document.createTextNode('MP Lobby'));
                mpLobby.appendChild(mpLink);

                matchDiv.appendChild(mpLobby);
            }

            matchHistory.appendChild(matchDiv);
        });
    } else {
        matches.forEach(match => {
            var opponent = match.opponent;

            var matchDiv = createDiv(['match']);
            var stage = createDiv(['stage'], match.stage);
            var player = createDiv(['player']);

            var countryFlag = document.createElement('img');
            countryFlag.setAttribute('src', `https://assets.ppy.sh/old-flags/${opponent.country}.png`);

            var profileLink = document.createElement('a');
            profileLink.setAttribute('href', `https://osu.ppy.sh/users/${opponent.userId}`);
            profileLink.setAttribute('target', '_blank');
            profileLink.append(document.createTextNode(opponent.username));

            appendChildren(player, [countryFlag, profileLink]);

            var results = createDiv(['results'], `${match.winnerScore} - ${match.loserScore}`);
            if (match.outcome == 0) results.classList.add('match-won');
            else if (match.outcome == 1) results.classList.add('match-lost');
            else results.classList.add('match-forfeited');

            appendChildren(matchDiv, [stage, player, results]);

            if (match.mpLink !== '-') {
                var mpLobby = createDiv(['mp-lobby']);

                var mpLink = document.createElement('a');
                mpLink.setAttribute('href', match.mpLink);
                mpLink.setAttribute('target', '_blank');
                mpLink.append(document.createTextNode('MP Lobby'));
                mpLobby.appendChild(mpLink);

                matchDiv.appendChild(mpLobby);
            }

            matchHistory.appendChild(matchDiv);
        });
    }

    // Entrance animations
    for (let i = 0; i < 4; i++) {
        stats.childNodes[i].style.animation = fadeInDown;
        stats.childNodes[i + 4].style.animation = fadeInUp;
        await sleep(120);
    }

    const matchDivs = document.querySelectorAll('.match');
    if (playerHistory[index].info.isTeamTournament) {
        for (let i = 0; i < matchDivs.length; i++) {
            matchDivs[i].childNodes[0].style.animation = fadeInDown;
            
            var team = matchDivs[i].childNodes[1];

            team.childNodes[0].style.animation = fadeInUp;

            var players = team.childNodes[1];
            for (let j = 0; j < players.childNodes.length; j++) {
                if (players.childNodes[j].classList.value.includes('player-in-team')) {
                    players.childNodes[j].style.animation = fadeIn;
                    await sleep(25);
                }
            }

            for (let j = 0; j < players.childNodes.length; j++) {
                if (players.childNodes[j].classList.value.includes('separator')) {
                    players.childNodes[j].style.animation = fadeIn;
                    await sleep(15);
                }
            }

            matchDivs[i].childNodes[2].style.animation = fadeInUp;
            if (matchDivs[i].childNodes[3]) {
                await sleep(30);
                matchDivs[i].childNodes[3].style.animation = fadeInDown;
            }
            await sleep(120);
        }

        document.querySelectorAll('.separator')
    } else {
        for (let i = 0; i < matchDivs.length; i++) {
            matchDivs[i].childNodes[0].style.animation = fadeInDown;
            matchDivs[i].childNodes[1].style.animation = fadeIn;
            await sleep(30);
            
            matchDivs[i].childNodes[2].style.animation = fadeInUp;
            if (matchDivs[i].childNodes[3]) {
                await sleep(30);
                matchDivs[i].childNodes[3].style.animation = fadeInDown;
            }
            await sleep(120);
        }
    }

    await sleep(600);
    overlay.setAttribute('onclick', 'hideOverlay(event)');
}

async function displayPlayerStats() {
    const overlay = createOverlay();
    const playerStatsContainer = createDiv(['overlay-container']);
    playerStatsContainer.id = 'player-stats-container';
    overlay.appendChild(playerStatsContainer);

    document.body.style.overflow = 'hidden';

    const header = createDiv(['header']);
    const h1 = document.createElement('h1');
    h1.append(document.createTextNode('Player History Stats'));
    header.appendChild(h1);
    playerStatsContainer.appendChild(header);

    // Placements
    const placements = createDiv(['placements']);
    playerStatsContainer.appendChild(placements);

    createGridElements(['Tournament Stats'], placements, ['sub-header']);

    createGridElements(['1st Place Finishes', '2nd Place Finishes', '3rd Place Finishes'], placements, ['head']);

    const firstPlaceFinishes = (playerHistory.filter(tournament => tournament.info.placement.includes('1st')).length).toString();
    const secondPlaceFinishes = (playerHistory.filter(tournament => tournament.info.placement.includes('2nd')).length).toString();
    const thirdPlaceFinishes = (playerHistory.filter(tournament => tournament.info.placement.includes('3rd')).length).toString();
    const totalTournamentsPlayed = (playerHistory.length).toString();

    const tournamentsPlayedSpan = document.createElement('span');
    tournamentsPlayedSpan.append(document.createTextNode('Total Tournaments Played In: '));

    createGridElements([firstPlaceFinishes, secondPlaceFinishes, thirdPlaceFinishes, totalTournamentsPlayed], placements, ['element']);

    document.querySelectorAll('.element')[3].prepend(tournamentsPlayedSpan);

    // Border
    const border = createDiv(['border']);
    playerStatsContainer.appendChild(border);

    // Match stats
    const matchStats = createDiv(['match-stats']);
    playerStatsContainer.appendChild(matchStats);

    createGridElements(['Match Stats'], matchStats, ['sub-header']);

    const matches = [];
    playerHistory.forEach(tournament => matches.push(... tournament.matches));

    createGridElements(['Total Matches', 'Matches Won', 'Matches Lost', 'Forfeits'], matchStats, ['head']);

    const totalMatches = matches.length;
    const matchesWon = (matches.filter(match => match.outcome == 0).length).toString();
    const matchesLost = (matches.filter(match => match.outcome == 1).length).toString();
    const forfeits = (matches.filter(match => match.outcome > 1).length).toString();
    const winrate = ((Number(matchesWon) / (Number(totalMatches) - Number(forfeits))) * 100).toFixed(2);

    const winrateSpan = document.createElement('span');
    winrateSpan.append(document.createTextNode('Winrate: '));

    createGridElements([totalMatches, matchesWon, matchesLost, forfeits, `${winrate}% (Excluding forfeits)`], matchStats, ['element']);

    document.querySelectorAll('.element')[8].prepend(winrateSpan);

    // Entrance animations
    await sleep(450);
    placements.childNodes[0].style.animation = fadeIn;
    await sleep(120);
    for (let i = 1; i < 4; i++) {
        placements.childNodes[i].style.animation = fadeInDown;
        placements.childNodes[i + 3].style.animation = fadeInUp;
    }
    await sleep(120);
    placements.childNodes[7].style.animation = fadeInUp;
    
    await sleep(150);
    matchStats.childNodes[0].style.animation = fadeIn;
    await sleep(120);
    for (let i = 1; i < 5; i++) {
        matchStats.childNodes[i].style.animation = fadeInDown;
        matchStats.childNodes[i + 4].style.animation = fadeInUp;
    }
    await sleep(120);
    matchStats.childNodes[9].style.animation = fadeInUp;

    await sleep(600);
    overlay.setAttribute('onclick', 'hideOverlay(event)');
}

async function displayStaffStats() {
    const overlay = createOverlay();
    const staffStatsContainer = createDiv(['overlay-container']);
    staffStatsContainer.id = 'staff-stats-container';
    overlay.appendChild(staffStatsContainer);

    document.body.style.overflow = 'hidden';

    const header = createDiv(['header']);
    const h1 = document.createElement('h1');
    h1.append(document.createTextNode('Staff History Stats'));
    header.appendChild(h1);
    staffStatsContainer.appendChild(header);

    // Roles
    const roles = createDiv(['roles']);
    staffStatsContainer.appendChild(roles);

    createGridElements(['Times Staffed As...'], roles, ['sub-header']);

    const staffRoles = ['Referee', 'Mappooler', 'GFX Designer', 'Spreadsheeter', 'Streamer', 'Commentator', 'Playtester'];
    const timesStaffedAs = [];
    staffRoles.forEach(role => {
        timesStaffedAs.push((staffHistory.filter(tournament => tournament.roles.includes(role)).length).toString());
    });

    const totalTournamentsStaffed = staffHistory.length;
    const tournamentsStaffedSpan = document.createElement('span');
    tournamentsStaffedSpan.append(document.createTextNode('Total Tournaments Staffed In: '));

    const row1 = createDiv(['row-1']);
    roles.appendChild(row1);
    createGridElements(['Referee', 'Mappooler', 'GFX Designer', 'Spreadsheeter'], row1, ['head']);
    createGridElements([timesStaffedAs[0], timesStaffedAs[1], timesStaffedAs[2], timesStaffedAs[3]], row1, ['element']);

    const row2 = createDiv(['row-2']);
    roles.appendChild(row2);
    createGridElements(['Streamer', 'Commentator', 'Playtester'], row2, ['head']);
    createGridElements([timesStaffedAs[4], timesStaffedAs[5], timesStaffedAs[6], totalTournamentsStaffed], row2, ['element']);

    document.querySelectorAll('.element')[7].prepend(tournamentsStaffedSpan);

    // Entrance animations
    await sleep(450);
    roles.childNodes[0].style.animation = fadeIn;
    await sleep(120);

    const heads = document.querySelectorAll('.head');
    const elements = document.querySelectorAll('.element');
    for (let i = 0; i < 7; i++) {
        heads[i].style.animation = fadeInDown;
        elements[i].style.animation = fadeInUp;
    }
    await sleep(250);
    row2.childNodes[6].style.animation = fadeInUp;

    await sleep(600);
    overlay.setAttribute('onclick', 'hideOverlay(event)');
}

async function displayFullImage(e) {
    if (window.matchMedia("(max-width: 890px)").matches) return;

    const overlay = createOverlay();
    const imageContainer = createDiv(['overlay-container']);
    imageContainer.id = 'image-container';
    overlay.appendChild(imageContainer);

    const imageContainer1 = document.createElement('div');
    imageContainer1.id = 'image-container-1';
    imageContainer.appendChild(imageContainer1);

    document.body.style.overflow = 'hidden';

    const leftBtnDiv = createDiv(['element', 'image-btn']);
    const imageDiv = createDiv(['element']);
    const rightBtnDiv = createDiv(['element', 'image-btn']);

    appendChildren(imageContainer1, [leftBtnDiv, imageDiv, rightBtnDiv]);

    const imageUrl = e.target.currentSrc;
    const imageWidth = Number(e.target.width);
    const imageHeight = Number(e.target.height);

    // Sets up the image to display
    const image = document.createElement('img');
    image.setAttribute('src', imageUrl);
    image.id = `displayed-${e.target.classList.value}`;
    imageDiv.appendChild(image);

    if (imageWidth > imageHeight * 3.5) image.style.height = '40%';
    else if (imageWidth > imageHeight * 2) image.style.height = '45%';
    else image.style.height = '80%';

    // Sets up the buttons
    const leftBtn = document.createElement('button');
    leftBtn.setAttribute('onclick', 'changeImage("Previous")');
    leftBtnDiv.appendChild(leftBtn);

    const rightBtn = document.createElement('button');
    rightBtn.setAttribute('onclick', 'changeImage("Next")');
    rightBtnDiv.appendChild(rightBtn);

    // Entrance animations
    await sleep(60);
    leftBtn.style.animation = fadeIn;
    rightBtn.style.animation = fadeIn;

    await sleep(100);
    document.querySelector(`#displayed-${e.target.classList.value}`).style.animation = fadeInDown;

    await sleep(600);
    overlay.setAttribute('onclick', 'hideOverlay(event)');
}

async function changeImage(display) {
    const image = document.querySelectorAll('.element')[1].childNodes[0];
    const imageUrl = image.currentSrc;
    const bannerType = `${image.id.split('-')[1]}-banner`;

    const banners = (bannerType == 'player-banner') ? allPlayerBanners : allStaffBanners;
    const bannerUrls = [];
    banners.forEach(banner => bannerUrls.push(banner.currentSrc));

    const sumValue = (display == 'Next') ? 1 : -1;
    const index = bannerUrls.indexOf(imageUrl) + sumValue;

    const newImage = banners[index];
    if (!newImage) return;

    const newImageWidth = newImage.width;
    const newImageHeight = newImage.height;
    const newImageUrl = bannerUrls[index];
    
    var animationName = (display == 'Next') ? 'fadeOutUp' : 'fadeOutDown';
    image.style.animation = `${animationName} 0.3s forwards`;

    await sleep(300);
    image.src = newImageUrl;

    if (newImageWidth > newImageHeight * 3.5) image.style.height = '40%';
    else if (newImageWidth > newImageHeight * 2) image.style.height = '45%';
    else image.style.height = '80%';

    var animationName = (display == 'Next') ? 'fadeInUp' : 'fadeInDown';
    image.style.animation = `${animationName} 0.3s forwards`;
}