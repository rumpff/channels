const channelsPerPage = 12;
const iconTooltipDelay = 800;
const baseVolume = 0.3;

const menu = document.querySelector('.menu');
const menuTrack = document.querySelector('.menu-track');
const banner = document.querySelector('.banner');
const bannerContentContainer = document.querySelector('.banner-content-container');
const bgm = document.getElementById('bgm');

const channelIcons = [];
const channelBanners = [];


const buttonBannerMenu = document.querySelector('.banner-button[data-action="return-to-menu"]');
const buttonBannerLaunch = document.querySelector('.banner-button[data-action="launch-channel"]');

const audioBasePath = "assets/snd/";

let currentIcon;
let channelScale;

let hoverTimer;


function initMenu() {
    createIcons();
    createBanners();

    observer.observe(channelIcons[0]);
    buttonBannerMenu.addEventListener("click", ()=> { closeChannel(); playSound('click.wav');});
    buttonBannerMenu.addEventListener('mouseenter', () => { playSound("hover.wav");});
    buttonBannerLaunch.addEventListener('mouseenter', () => { playSound("hover.wav");});
    bgm.play();
    bgm.volume = baseVolume;
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
    iconOutline.src = "assets/img/icon-outline.png";
    icon.appendChild(iconOutline);

    let iconSelect = document.createElement('img');

    iconSelect.className = "channel-icon-select";
    iconSelect.src = "assets/img/icon-select.png";
    icon.appendChild(iconSelect);

    let iconTooltip = document.createElement('div');
    iconTooltip.className = "channel-icon-tooltip";
    iconTooltip.style.setProperty('--hover-delay', iconTooltipDelay + 'ms');
    icon.appendChild(iconTooltip);

    let iconTooltipLabel = document.createElement('span');
    iconTooltipLabel.className = "channel-icon-tooltip-label";
    iconTooltipLabel.textContent = channelLibrary[channelId].displayName;
    iconTooltip.appendChild(iconTooltipLabel);


    if(channelLibrary[channelId].bannerLayout != ``) {
        // channer has a banner and thus is clickable
        icon.addEventListener("click", () => { openChannel(channelId, icon); playSound('click.wav');});
        icon.dataset.clickable = "true";
    }
    else {
        icon.dataset.clickable = "false";
    }



    icon.addEventListener('mouseenter', () => { 
        playSound("hover.wav");

        hoverTimer = setTimeout(() => {
            playSound('icon_tooltip.wav', 0.5);
        }, iconTooltipDelay);
    });

    icon.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
    });

    // icon.style.

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

    buttonBannerLaunch.onclick = () => { launchChannel(channelId); playSound("launch.wav")}, {once: true};

    bannerZoom(true);
    playSound("banner_zoom_in.wav");
    bgm.pause();
}

function closeChannel() {
    menu.dataset.state = "active"
    banner.dataset.state = "inactive";
    bannerZoom(false);
    playSound("banner_zoom_out.wav");
    bgm.play();
}

function bannerZoom(isZoomingIn) {
    const timingIn = '0.4s cubic-bezier(0.32, 0, 0.67, 0)';
    const timingOut = '0.4s cubic-bezier(0.33, 1, 0.68, 1)';
    let timing;

    menu.style.transition = banner.style.transition = 'none';

    const startSiteTransform = getComputedStyle(menu).transform;
    const startMoverTransform = getComputedStyle(banner).transform;

    menu.style.transform = 'none';
    banner.style.transform = 'none'; 

    menu.offsetHeight; 

    const tRect = currentIcon.getBoundingClientRect();
    const mRect = banner.getBoundingClientRect();
    const sRect = menu.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

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
        menu.style.transformOrigin = `${originX}px ${originY}px`;
        banner.style.transform = `translate3d(${returnX}px, ${returnY}px, 0) scale(${returnScale})`;
        banner.style.opacity = 0;

        timing = timingIn;
    } else {
        menu.style.transform = startSiteTransform;
        banner.style.transform = startMoverTransform;

        timing = timingOut
    }

    // Double requestAnimationFrame ensures the "Starting Point" is painted first
    requestAnimationFrame(() => {
        menu.offsetHeight;
        requestAnimationFrame(() => {
            menu.style.transition = `none ${timing}`;
            menu.style.transitionProperty = `transform, opacity`;

            banner.style.transition = `none ${timing}`;
            banner.style.transitionProperty = `transform, opacity`;

            if (isZoomingIn) {
                menu.style.transform = `translate3d(${siteMoveX}px, ${siteMoveY}px, 0) scale(${scaleAmount})`;
                banner.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) scale(1)`;
                banner.style.opacity = 1;
                menu.style.opacity = 0;
            } else {
                menu.style.transform = `translate3d(0, 0, 0) scale(1)`;
                banner.style.transform = `translate3d(${returnX}px, ${returnY}px, 0) scale(${returnScale})`;
                banner.style.opacity = 0;
                menu.style.opacity = 1;

                // Cleanup after the return animation finishes
                const onEnd = (e) => {
                    if (e.target === banner) {
                        menu.style.transition = banner.style.transition = 'none';
                        menu.style.transform = banner.style.transform = '';
                        menu.style.transformOrigin = '';
                        banner.removeEventListener('transitionend', onEnd);
                    }
                };
                banner.addEventListener('transitionend', onEnd);
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

function playSound(soundPath, volume = 1) {
    const audio = new Audio(audioBasePath + soundPath);
    audio.volume = volume * baseVolume;

    audio.play().catch(err => {
    console.warn(err);
    });

    audio.onended = () => {
    audio.remove();
    };
}

initMenu();