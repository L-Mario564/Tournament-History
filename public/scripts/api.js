const playerHistory = [];
const staffHistory = [];
const allPlayerBanners = [];
const allStaffBanners = [];

function createDiv(classes, textNode) {
    var div = document.createElement('div');
    if (classes.length > 0) div.classList.add(... classes);
    if (textNode) div.append(document.createTextNode(textNode));
    return div;
}

async function getData(contentToFetch) {
    const url = `getData/${contentToFetch}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
}

function appendChildren(parent, children) {
    for (i = 0; i < children.length; i++) {
        parent.appendChild(children[i]);
    }
}

async function loadPlayerHistoryContent() {
    const tournaments = await getData('playerHistory'); 
    const tournamentsContainer = document.querySelectorAll('.tournaments-container')[0];

    tournaments.reverse().forEach(tournament => {
        var info = tournament.info;
        var team = tournament.team;

        var container = createDiv(['tournament', 'animated-element']);
        container.style.backgroundImage = `url("${info.bannerUrl}")`;
        tournamentsContainer.appendChild(container);

        // Header div
        var headerDiv = createDiv(['header']);
        container.appendChild(headerDiv);

        var tournamentName = createDiv(['tournament-name', 'animated-element']);
        var placement = createDiv(['placement', 'animated-element']);

        var forumPostUrl = (!info.forumPostId.includes('https:')) ? `https://osu.ppy.sh/community/forums/topics/${info.forumPostId}` : info.forumPostId;

        var forumPostLink = document.createElement('a');
        forumPostLink.setAttribute('href', forumPostUrl);
        forumPostLink.setAttribute('target', '_blank');
        forumPostLink.append(document.createTextNode(info.name));
        tournamentName.appendChild(forumPostLink);

        if (info.challongeId !== '-') {
            var challongeLink = document.createElement('a');
            var challongeUrl = (!info.challongeId.includes('https:')) ? `https://challonge.com/${info.challongeId}` : info.challongeId;
            challongeLink.setAttribute('href', challongeUrl);
            challongeLink.setAttribute('target', '_blank');
            challongeLink.append(document.createTextNode(info.placement));
            placement.appendChild(challongeLink);
        }

        appendChildren(headerDiv, [tournamentName, placement]);

        // Info div
        var infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        container.appendChild(infoDiv);

        var date = createDiv(['date', 'animated-element'], info.date);
        var rankRange = createDiv(['rank-range', 'animated-element'], info.rankRange);
        var format = createDiv(['format', 'animated-element'], info.format);
        var bracket = createDiv(['bracket', 'animated-element'], info.bracket);

        var participantCount = (info.isTeamTournament) ? `${info.participantCount} Teams` :     `${info.participantCount} Players`;
        var participantCountDiv = createDiv(['participant-count', 'animated-element'], participantCount);

        var seeding = (info.seeding == '-') ? '' : `Seeded ${info.seeding}`;
        var seedingDiv = createDiv(['seeding', 'animated-element'], seeding);

        var matchHistory = createDiv(['match-history', 'animated-element']);
        var matchHistoryBtn = document.createElement('button');
        matchHistoryBtn.classList.add('show-btn', 'animated-element');
        matchHistoryBtn.setAttribute('onclick', `displayMatchHistory(${tournaments.indexOf(tournament)})`);
        matchHistoryBtn.append(document.createTextNode('Show Match History'))
        matchHistory.appendChild(matchHistoryBtn);

        appendChildren(infoDiv, [date, rankRange, format, bracket, participantCountDiv, seedingDiv, matchHistory]);

        if (info.isTeamTournament) {
            // Border div
            var borderDiv = createDiv(['border']);
            container.appendChild(borderDiv);

            // Team div
            var teamDiv = createDiv(['team']);
            container.appendChild(teamDiv);

            var teamName = createDiv(['team-name', 'animated-element'], team.teamName);

            var teamSize = team.teammates.length + 1;
            var teammatesDiv = createDiv(['teammates', `team-size-${teamSize}`]);

            appendChildren(teamDiv, [teamName, teammatesDiv]);

            // Teammates div
            team.teammates.forEach(player => {
                var playerDiv = createDiv(['player']);
                teammatesDiv.appendChild(playerDiv);

                var countryFlag = document.createElement('img');
                countryFlag.setAttribute('src', `https://assets.ppy.sh/old-flags/${player.country}.png`);
                var countryFlagDiv = createDiv(['country-flag', 'animated-element']);
                countryFlagDiv.appendChild(countryFlag);

                var username = createDiv(['username', 'animated-element'])
                var profileLink = document.createElement('a');
                profileLink.setAttribute('href', `https://osu.ppy.sh/users/${player.userId}`);
                profileLink.setAttribute('target', '_blank');
                profileLink.append(document.createTextNode(player.username));
                username.appendChild(profileLink)

                appendChildren(playerDiv, [countryFlagDiv, username]);
            });
        }
    });

    tournaments.forEach(tournament => playerHistory.push(tournament));
}

async function loadStaffHistoryContent() {
    const tournaments = await getData('staffHistory');
    const tournamentsContainer = document.querySelectorAll('.tournaments-container')[1];

    tournaments.reverse().forEach(tournament => {
        var host = tournament.host;
        var roles = tournament.roles;

        var container = createDiv(['tournament', 'animated-element']);
        container.style.backgroundImage = `url(${tournament.bannerUrl})`;
        tournamentsContainer.appendChild(container);

        // Header div
        var headerDiv = createDiv(['header']);
        container.appendChild(headerDiv);

        var tournamentName = createDiv(['tournament-name']);

        var forumPostUrl = (!tournament.forumPostId.includes('https:')) ? `https://osu.ppy.sh/community/forums/topics/${tournament.forumPostId}` : tournament.forumPostId;

        var forumPostLink = document.createElement('a');
        forumPostLink.setAttribute('href', forumPostUrl);
        forumPostLink.setAttribute('target', '_blank');
        forumPostLink.append(document.createTextNode(tournament.name));
        tournamentName.appendChild(forumPostLink);

        var date = createDiv(['date'], tournament.date);

        var hostDiv = createDiv(['host'], 'Hosted by ');

        var countryFlag = document.createElement('img');
        countryFlag.setAttribute('src', `https://assets.ppy.sh/old-flags/${host.country}.png`);
        hostDiv.appendChild(countryFlag);
        hostDiv.append(document.createTextNode(' '));

        var profileLink = document.createElement('a');
        profileLink.setAttribute('href', `https://osu.ppy.sh/users/${host.userId}`);
        profileLink.setAttribute('target', '_blank');
        profileLink.append(document.createTextNode(host.username));
        hostDiv.appendChild(profileLink);

        appendChildren(headerDiv, [tournamentName, date, hostDiv]);

        // Border div
        var borderDiv = createDiv(['border']);
        container.appendChild(borderDiv);

        // Roles div
        var roleCount = roles.length;
        var rolesDiv = createDiv(['roles', `role-count-${roleCount}`]);
        container.appendChild(rolesDiv);

        roles.forEach(role => {
            var roleDiv = createDiv(['role'], role);
            rolesDiv.appendChild(roleDiv);
        });
    });

    tournaments.forEach(tournament => staffHistory.push(tournament));
}

async function loadBannersContent() {
    const banners = await getData('banners');
    const playerBannersContainer = document.querySelector('#player-banners');
    const staffBannersContainer = document.querySelector('#staff-banners');

    banners.reverse().forEach(banner => {
        var bannerDiv = document.createElement('div');

        var bannerImg = document.createElement('img');
        var bannerClass = (banner.type == 'Player') ? 'player-banner' : 'staff-banner';
        bannerImg.classList.add(bannerClass);
        bannerImg.setAttribute('src', banner.bannerUrl);
        bannerImg.setAttribute('onclick', 'displayFullImage(event)');
        bannerDiv.appendChild(bannerImg);

        if (banner.type == 'Player') playerBannersContainer.append(bannerDiv);
        else staffBannersContainer.append(bannerDiv);
    });

    document.querySelectorAll('.staff-banner').forEach(banner => allStaffBanners.push(banner));
    document.querySelectorAll('.player-banner').forEach(banner => allPlayerBanners.push(banner));
}