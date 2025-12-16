// DOM Elements
const loginForm = document.getElementById('login-form');
const loginView = document.getElementById('login-view');
const modulesView = document.getElementById('modules-view'); // New View
const dashboardView = document.getElementById('dashboard-view');
const navItems = document.querySelectorAll('.nav-item[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('logout-btn');
const modulesLogoutBtn = document.getElementById('modules-logout-btn');

// Module Elements
const moduleImpactWrench = document.getElementById('module-impact-wrench');
const moduleOtherTools = document.getElementById('module-other-tools');

// --- Authentication & Navigation Logic ---

// 1. LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (email) {
        performLogin();
    }
});

function performLogin() {
    // Hide Login
    loginView.style.opacity = '0';

    setTimeout(() => {
        loginView.classList.remove('active');
        loginView.classList.add('hidden');

        // Show Module Selection instead of Dashboard directly
        modulesView.classList.remove('hidden');
        void modulesView.offsetWidth; // trigger reflow
        modulesView.style.opacity = '1'; // Ensure visible logic matches CSS
    }, 500);
}

// --- Navigation Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // Re-select elements inside ensure they exist
    const moduleImpactWrench = document.getElementById('module-impact-wrench');
    const moduleOtherTools = document.getElementById('module-other-tools');
    const modulesView = document.getElementById('modules-view');
    const dashboardView = document.getElementById('dashboard-view');

    // 2. MODULE SELECTION RE-BIND
    // Using global function for robustness (see below)

    if (moduleOtherTools) {
        moduleOtherTools.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Bind Sidebar Nav
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
});

// GLOBAL FUNCTION for Module Click (Foolproof)
window.openImpactWrenchModule = function () {
    console.log("Global Module Click Triggered");

    const modulesView = document.getElementById('modules-view');
    const dashboardView = document.getElementById('dashboard-view');

    // Go to Dashboard
    modulesView.style.opacity = '0';
    setTimeout(() => {
        modulesView.classList.add('hidden');

        dashboardView.classList.remove('hidden');
        void dashboardView.offsetWidth;
        dashboardView.classList.add('active');

        // Reset to first tab
        if (typeof switchTab === 'function') {
            switchTab('how-to-use');
        }
    }, 500);
}

const allDetailViews = document.querySelectorAll('.main-content [id$="-view"]');
const allListContainers = [
    document.querySelector('.hero-card'),
    document.querySelector('.grid-container'),
    document.getElementById('best-practices-list'),
    document.getElementById('maintenance-grid')
];

function resetSubmodules() {
    // 1. Close all detailed views
    allDetailViews.forEach(view => {
        view.classList.add('hidden');
    });

    // 2. Show all main list containers (reset visibility)
    // Note: We only unhide them. They will still be inside their parent tab.
    // If the parent tab is hidden, they won't be visible.
    // If the parent tab is shown, they will be visible (Restoring default state).
    allListContainers.forEach(container => {
        if (container) container.classList.remove('hidden');
    });
}

function switchTab(tabId) {
    // 0. RESET STATE of all modules/accordions
    resetSubmodules();

    // 1. Update Sidebar Active State
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2. Update Content Area
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.remove('hidden');
            content.classList.add('active');
        } else {
            content.classList.add('hidden');
            content.classList.remove('active');
        }
    });
}

// --- Unboxing Navigation Logic ---
const unboxingCard = document.getElementById('unboxing-card');
const unboxingVideoView = document.getElementById('unboxing-video-view');
const backToDashboardBtn = document.getElementById('back-to-dashboard');

// --- First Charge Navigation Logic ---
const firstChargeCard = document.getElementById('first-charge-card');
const firstChargeView = document.getElementById('first-charge-view');
const backFromChargeBtn = document.getElementById('back-from-charge');

// --- Torque Adjustment Navigation Logic ---
const torqueCard = document.getElementById('torque-adjustment-card');
const torqueView = document.getElementById('torque-adjustment-view');
const backFromTorqueBtn = document.getElementById('back-from-torque');

// --- "How to Use" (Video Gallery) Navigation Logic ---
const howToUseCard = document.getElementById('how-to-use-card');
const howToUseView = document.getElementById('how-to-use-view');
const backFromHowToUseBtn = document.getElementById('back-from-how-to-use');

// Common Elements
const heroCard = document.querySelector('.hero-card');
const gridContainer = document.querySelector('.grid-container');

function openDetailView(view) {
    if (heroCard) heroCard.classList.add('hidden');
    if (gridContainer) gridContainer.classList.add('hidden');
    view.classList.remove('hidden');
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
}

function closeDetailView(view) {
    view.classList.add('hidden');
    if (heroCard) heroCard.classList.remove('hidden');
    if (gridContainer) gridContainer.classList.remove('hidden');
}

// Unboxing Events
if (unboxingCard && unboxingVideoView) {
    unboxingCard.addEventListener('click', () => openDetailView(unboxingVideoView));
}
if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener('click', () => closeDetailView(unboxingVideoView));
}

// First Charge Events
if (firstChargeCard && firstChargeView) {
    firstChargeCard.addEventListener('click', () => openDetailView(firstChargeView));
}
if (backFromChargeBtn) {
    backFromChargeBtn.addEventListener('click', () => closeDetailView(firstChargeView));
}

// Torque Adjustment Events
if (torqueCard && torqueView) {
    torqueCard.addEventListener('click', () => openDetailView(torqueView));
}
if (backFromTorqueBtn) {
    backFromTorqueBtn.addEventListener('click', () => closeDetailView(torqueView));
}

// "How to Use" (Video Gallery) Events
if (howToUseCard && howToUseView) {
    howToUseCard.addEventListener('click', () => openDetailView(howToUseView));
}
if (backFromHowToUseBtn) {
    backFromHowToUseBtn.addEventListener('click', () => closeDetailView(howToUseView));
}

// --- Best Practices Navigation Logic ---
const correctPositioningCard = document.getElementById('correct-positioning-card');
const correctPositioningView = document.getElementById('correct-positioning-view');
const backFromPositioningBtn = document.getElementById('back-from-positioning');
const bestPracticesList = document.getElementById('best-practices-list');

if (correctPositioningCard && correctPositioningView && bestPracticesList) {
    correctPositioningCard.addEventListener('click', () => {
        bestPracticesList.classList.add('hidden');
        correctPositioningView.classList.remove('hidden');
    });
}

if (backFromPositioningBtn && bestPracticesList) {
    backFromPositioningBtn.addEventListener('click', () => {
        correctPositioningView.classList.add('hidden');
        bestPracticesList.classList.remove('hidden');
    });
}

// Work Cycles Navigation
const workCyclesCard = document.getElementById('work-cycles-card');
const workCyclesView = document.getElementById('work-cycles-view');
const backFromWorkCyclesBtn = document.getElementById('back-from-work-cycles');

if (workCyclesCard && workCyclesView && bestPracticesList) {
    workCyclesCard.addEventListener('click', () => {
        bestPracticesList.classList.add('hidden');
        workCyclesView.classList.remove('hidden');
    });
}

if (backFromWorkCyclesBtn && bestPracticesList) {
    backFromWorkCyclesBtn.addEventListener('click', () => {
        workCyclesView.classList.add('hidden');
        bestPracticesList.classList.remove('hidden');
    });
}

// Lubrication Navigation
const lubricationCard = document.getElementById('lubrication-card');
const lubricationView = document.getElementById('lubrication-view');
const backFromLubricationBtn = document.getElementById('back-from-lubrication');

if (lubricationCard && lubricationView && bestPracticesList) {
    lubricationCard.addEventListener('click', () => {
        bestPracticesList.classList.add('hidden');
        lubricationView.classList.remove('hidden');
    });
}

if (backFromLubricationBtn && bestPracticesList) {
    backFromLubricationBtn.addEventListener('click', () => {
        lubricationView.classList.add('hidden');
        bestPracticesList.classList.remove('hidden');
    });
}

// External Cleaning Navigation
const externalCleaningCard = document.getElementById('external-cleaning-card');
const externalCleaningView = document.getElementById('external-cleaning-view');
const backFromExternalCleaningBtn = document.getElementById('back-from-external-cleaning');
const maintenanceGrid = document.getElementById('maintenance-grid');

if (externalCleaningCard && externalCleaningView && maintenanceGrid) {
    externalCleaningCard.addEventListener('click', () => {
        maintenanceGrid.classList.add('hidden');
        externalCleaningView.classList.remove('hidden');
        // Scroll to top
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTop = 0;
    });
}

if (backFromExternalCleaningBtn && maintenanceGrid) {
    backFromExternalCleaningBtn.addEventListener('click', () => {
        externalCleaningView.classList.add('hidden');
        maintenanceGrid.classList.remove('hidden');
    });
}

// --- Generic Video Logic (Direct Redirect) ---
const watchButtons = document.querySelectorAll('.btn-watch');

watchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const videoSrc = btn.getAttribute('data-video-src');
        if (videoSrc) {
            // Convert embed URL to watch URL for direct viewing
            // From: https://www.youtube.com/embed/VIDEO_ID
            // To:   https://www.youtube.com/watch?v=VIDEO_ID
            const watchUrl = videoSrc.replace('embed/', 'watch?v=');
            window.open(watchUrl, '_blank');
        }
    });
});

// Storage Navigation
const storageCard = document.getElementById('storage-card');
const storageView = document.getElementById('storage-view');
const backFromStorageBtn = document.getElementById('back-from-storage');

if (storageCard && storageView && maintenanceGrid) {
    storageCard.addEventListener('click', () => {
        maintenanceGrid.classList.add('hidden');
        storageView.classList.remove('hidden');
        // Scroll to top
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTop = 0;
    });
}

if (backFromStorageBtn && maintenanceGrid) {
    backFromStorageBtn.addEventListener('click', () => {
        storageView.classList.add('hidden');
        maintenanceGrid.classList.remove('hidden');
    });
}
