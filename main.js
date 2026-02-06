const menuTrack = document.querySelector('.menu-track');
const channelsPerPage = 12;

function initMenu() {
    createIcons();
    createBanners();
}

function createIcons() {

    let channelCount;
    let currentPage;

    for(channelCount = 0; channelCount < channelLayout.length; channelCount++) {

        // create new page
        if(channelCount === 0 || channelCount % channelsPerPage === 0) {
            currentPage = document.createElement('section');
            currentPage.className = "menu-page"
            menuTrack.appendChild(currentPage);
        }

        createIcon(channelLayout[channelCount], currentPage)
    }

    let remainingChannelSlots = channelsPerPage - (channelCount % channelsPerPage);
    for(let i = 0; i < remainingChannelSlots; i++){
        createIcon("empty", currentPage);
    }
}

function createIcon(channelId, menuPage) {
    let icon = document.createElement('section');
    menuPage.appendChild(icon);

    icon.className = "channel-icon"
    icon.dataset.id = channelId;

    if(channelLibrary[channelId].bannerLayout != ``)
    {
        icon.addEventListener("click", openChannel(channelId));
    }
}

function createBanners() {

}

initMenu();

const overlay = document.querySelector('.channel-banner');

overlay.addEventListener("click", closeChannel);

function openChannel(channelId) {
    overlay.dataset.state = "visible";
}

function closeChannel() {
    overlay.dataset.state = "hidden";
}