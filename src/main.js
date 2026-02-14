const channelsPerPage = 12;

const menu = document.querySelector('.menu');
const menuTrack = document.querySelector('.menu-track');
const banner = document.querySelector('.banner');
const bannerContentContainer = document.querySelector('.banner-content-container')
const channelIcons = [];
const channelBanners = [];

const buttonBannerMenu = document.querySelector('.banner-button[data-action="return-to-menu"]');
const buttonBannerLaunch = document.querySelector('.banner-button[data-action="launch-channel"]');

let currentIcon;
let channelScale;


function initMenu() {
    createIcons();
    createBanners();

    observer.observe(channelIcons[0]);
    buttonBannerMenu.addEventListener("click", closeChannel);
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

    // fill remainder slots with empty channels
    let remainingChannelSlots = channelsPerPage - (channelCount % channelsPerPage);
    for(let i = 0; i < remainingChannelSlots; i++) {
        createIcon("disc", currentPage);
    }
}

function createIcon(channelId, menuPage) {
    let icon = document.createElement('div');
    menuPage.appendChild(icon);

    icon.className = "channel-icon";
    icon.dataset.id = channelId;

    
    let iconContent = document.createElement('div');
    iconContent.className = "channel-icon-content";
    icon.appendChild(iconContent);

    let iconOutline = document.createElement('img');
    
    iconOutline.className = "channel-icon-outline";
    iconOutline.src = "assets/icon-outline.png";
    icon.appendChild(iconOutline);

    let iconSelect = document.createElement('img');

    iconSelect.className = "channel-icon-select";
    iconSelect.src = "assets/icon-select.png";
    icon.appendChild(iconSelect);



    if(channelLibrary[channelId].bannerLayout != ``) {
        // channer has a banner and thus is clickable
        icon.addEventListener("click", () => { openChannel(channelId, icon); });
        icon.dataset.clickable = "true";
    }
    else {
        icon.dataset.clickable = "false";
    }

    channelIcons[channelIcons.length] = icon;
}

function createBanners() {
    Object.keys(channelLibrary).forEach(currentChannelId => {
        let currentBannerLayout = channelLibrary[currentChannelId].bannerLayout;

        if(currentBannerLayout != ``)
        {
            let channelBanner = document.createElement('div');
            bannerContentContainer.appendChild(channelBanner);

            channelBanner.className = "banner-content";
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

function openChannel(channelId, icon) {
    
    currentIcon = icon;

    disableAllBanners();

    channelBanners[channelId].dataset.state = "enabled";

    menu.dataset.state = "inactive";

    banner.dataset.state = "active";
    banner.dataset.channel = channelId;

    buttonBannerLaunch.addEventListener("click", () => { launchChannel(channelId); }, {once: true});

    bannerZoom(true);
}

function closeChannel() {
    menu.dataset.state = "active"
    banner.dataset.state = "inactive";
    bannerZoom(false);
}

function bannerZoom(isZoomingIn) {
    const site = menu;
    const mover = banner;
    const target = currentIcon;
    const timingIn = '0.4s cubic-bezier(0.32, 0, 0.67, 0)';
    const timingOut = '0.4s cubic-bezier(0.33, 1, 0.68, 1)';
    let timing;

    // 1. PRE-FLIGHT: Kill transitions so we can measure "static" positions
    site.style.transition = mover.style.transition = 'none';

    // If zooming out, we MUST know where we are starting from (the zoomed state)
    const startSiteTransform = getComputedStyle(site).transform;
    const startMoverTransform = getComputedStyle(mover).transform;

    // 2. MEASUREMENT: Reset to natural state to find the "Home" of the icon
    site.style.transform = 'none';
    mover.style.transform = 'none';
    
    // This is the most important line: force the browser to acknowledge the reset
    site.offsetHeight; 

    const tRect = target.getBoundingClientRect();
    const mRect = mover.getBoundingClientRect();
    const sRect = site.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 3. MATH
    const scaleAmount = mRect.width / tRect.width;
    const originX = (tRect.left + tRect.width / 2) - sRect.left;
    const originY = (tRect.top + tRect.height / 2) - sRect.top;
    
    const centerX = (vw / 2) - (mRect.width / 2) - mRect.left;
    const centerY = (vh / 2) - (mRect.height / 2) - mRect.top;

    const returnX = tRect.left - mRect.left;
    const returnY = tRect.top - mRect.top;
    const returnScale = tRect.width / mRect.width;

    const siteMoveX = (vw / 2) - (tRect.left + tRect.width / 2);
    const siteMoveY = (vh / 2) - (tRect.top + tRect.height / 2);

    if (isZoomingIn) {
        // Prepare for Zoom In: Start at the icon
        site.style.transformOrigin = `${originX}px ${originY}px`;
        mover.style.transform = `translate3d(${returnX}px, ${returnY}px, 0) scale(${returnScale})`;
        mover.style.opacity = 0;

        timing = timingIn;
    } else {
        // Prepare for Zoom Out: Must start from the current zoomed-in position
        site.style.transform = startSiteTransform;
        mover.style.transform = startMoverTransform;

        timing = timingOut
    }

    // 5. TRIGGER ANIMATION
    // Double requestAnimationFrame ensures the "Starting Point" is painted first
    requestAnimationFrame(() => {
        site.offsetHeight; // One more flush for safety
        requestAnimationFrame(() => {
            site.style.transition = `none ${timing}`;
            site.style.transitionProperty = `transform, opacity`;

            mover.style.transition = `none ${timing}`;
            mover.style.transitionProperty = `transform, opacity`;

            if (isZoomingIn) {
                site.style.transform = `translate3d(${siteMoveX}px, ${siteMoveY}px, 0) scale(${scaleAmount})`;
                mover.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) scale(1)`;
                mover.style.opacity = 1;
                menu.style.opacity = 0;
            } else {
                site.style.transform = `translate3d(0, 0, 0) scale(1)`;
                mover.style.transform = `translate3d(${returnX}px, ${returnY}px, 0) scale(${returnScale})`;
                mover.style.opacity = 0;
                menu.style.opacity = 1;

                // Cleanup after the return animation finishes
                const onEnd = (e) => {
                    if (e.target === mover) {
                        site.style.transition = mover.style.transition = 'none';
                        site.style.transform = mover.style.transform = '';
                        site.style.transformOrigin = '';
                        mover.removeEventListener('transitionend', onEnd);
                    }
                };
                mover.addEventListener('transitionend', onEnd);
            }
        });
    });
}

function snapToTarget(mover, target) {
    // Reset
    mover.style.transition = 'none';
    mover.style.transform = 'none';
    
    // Force Reflow
    const _ = mover.offsetHeight; 
    
    // Calculate
    const mRect = mover.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    
    // Position exactly on top
    mover.style.transform = `translate(${tRect.left - mRect.left}px, ${tRect.top - mRect.top}px)`;
}

function launchChannel(channelId) {
    // window.open(channelLibrary[channelId].launchURL, "_self"); 
    console.log(`launching url: ${channelLibrary[channelId].launchURL}`);
}

const observer = new ResizeObserver(entries => {
  for (let entry of entries) {
    const height = entry.contentRect.height;
    channelScale = height / 200;
    document.documentElement.style.setProperty('--channel-scale', `${channelScale}`);
  }
});

initMenu();