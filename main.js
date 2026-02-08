const channelsPerPage = 12;

const menuTrack = document.querySelector('.menu-track');
const overlay = document.querySelector('.channel-banner');
const bannerContentContainer = document.querySelector('.channel-banner-content-container')
const channelBanners = [];


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

    // make sure each page is filled up
    let remainingChannelSlots = channelsPerPage - (channelCount % channelsPerPage);
    for(let i = 0; i < remainingChannelSlots; i++) {
        createIcon("empty", currentPage);
    }
}

function createIcon(channelId, menuPage) {
    let icon = document.createElement('section');
    menuPage.appendChild(icon);

    icon.className = "channel-icon"
    icon.dataset.id = channelId;

    if(channelLibrary[channelId].bannerLayout != ``) {
        // channer has a banner and thus is clickable
        icon.addEventListener("click", () => { openChannel(channelId); });
        icon.dataset.hasBanner = "true";
    }
    else {
        icon.dataset.hasBanner = "false";
    }
}

function createBanners() {
    Object.keys(channelLibrary).forEach(currentChannelId => {
        let currentBannerLayout = channelLibrary[currentChannelId].bannerLayout;

        if(currentBannerLayout != ``)
        {
            let channelBanner = document.createElement('div');
            bannerContentContainer.appendChild(channelBanner);

            channelBanner.className = "channel-banner-content";
            channelBanner.dataset.id = currentChannelId;
            channelBanner.dataset.state = "disabled";
            channelBanner.innerHTML = currentBannerLayout;

            channelBanners[currentChannelId] = channelBanner;
        }
    });
}

function disableAllBanners() {
    Object.keys(channelBanners).forEach(banner => {
        if(channelBanners[banner].dataset.state != "disabled")
            disableBanner(banner);
    });
}

function disableBanner(channelId) {
    channelBanners[channelId].dataset.state = "disabled";
}

overlay.addEventListener("click", closeChannel);

function openChannel(channelId) {
    
    disableAllBanners();

    channelBanners[channelId].dataset.state = "enabled";

    overlay.dataset.state = "visible";
    overlay.dataset.channel = channelId;
}

function closeChannel() {
    overlay.dataset.state = "hidden";
}

initMenu();