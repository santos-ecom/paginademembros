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
        modulesView.classList.add('active'); // CRTICAL: Enable pointer events
        modulesView.style.opacity = '1';
    }, 500);
}

// 3. LOGOUT - GLOBAL FUNCTION
window.performLogout = function () {
    console.log("Global Logout Triggered");

    // Determine which view is active to hide it
    const dashboardView = document.getElementById('dashboard-view');
    const modulesView = document.getElementById('modules-view');
    const loginView = document.getElementById('login-view');
    const loginForm = document.getElementById('login-form');

    const activeView = (dashboardView && dashboardView.classList.contains('active')) ? dashboardView :
        ((modulesView && !modulesView.classList.contains('hidden')) ? modulesView : null);

    if (activeView) {
        activeView.classList.remove('active');
        activeView.style.opacity = '0';
    }

    setTimeout(() => {
        if (activeView) activeView.classList.add('hidden');

        // Ensure ALL private views are hidden
        if (dashboardView) {
            dashboardView.classList.add('hidden');
            dashboardView.classList.remove('active');
        }
        if (modulesView) {
            modulesView.classList.add('hidden');
            modulesView.style.opacity = '0';
        }

        // Show Login
        if (loginView) {
            loginView.classList.remove('hidden');
            loginView.style.opacity = '';
            void loginView.offsetWidth;
            loginView.classList.add('active');
        }

        // Clear form
        if (loginForm) loginForm.reset();
    }, 500);
}

// Bind Logout Buttons (Legacy listener + ensure global access)
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

if (logoutBtn) logoutBtn.addEventListener('click', window.performLogout);
if (modulesLogoutBtn) modulesLogoutBtn.addEventListener('click', window.performLogout);
if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', window.performLogout);

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
window.openImpactWrenchModule = function (event) {
    if (event) event.stopPropagation();
    console.log("Opening Impact Wrench Module");
    navigateToView('dashboard-view');
}

window.openOtherToolsModule = function (event) {
    if (event) event.stopPropagation();
    console.log("Opening Other Tools Module - v5.8"); // Version Log
    resetSubmodules();

    // Explicitly unhide the tools grid to be 100% sure
    const toolsGrid = document.querySelector('#other-tools-view .grid-container');
    if (toolsGrid) toolsGrid.classList.remove('hidden');

    navigateToView('other-tools-view');
}

// Helper to handle transitions to any view
// Helper to handle transitions to any view
function navigateToView(viewId) {
    const modulesView = document.getElementById('modules-view');
    const targetView = document.getElementById(viewId);

    console.log(`Navigating to ${viewId}`, { modulesView, targetView });

    if (!targetView) {
        alert("System Error: View not found (" + viewId + ")");
        return;
    }

    if (modulesView) {
        modulesView.classList.add('hidden');
        modulesView.classList.remove('active');
        modulesView.style.opacity = '0';
    }

    // Immediate show without timeout
    targetView.classList.remove('hidden');
    void targetView.offsetWidth; // Force reflow
    targetView.classList.add('active');
    targetView.style.opacity = '1';

    // Special handling for dashboard tabs
    if (viewId === 'dashboard-view' && typeof switchTab === 'function') {
        switchTab('how-to-use');
    }
}

// GLOBAL FUNCTION to Go Back to Modules
window.backToModules = function () {
    console.log("Back to Modules Triggered");

    const dashboardView = document.getElementById('dashboard-view');
    const modulesView = document.getElementById('modules-view');

    if (dashboardView) {
        dashboardView.style.opacity = '0';
        dashboardView.classList.remove('active');

        setTimeout(() => {
            dashboardView.classList.add('hidden');

            if (modulesView) {
                modulesView.classList.remove('hidden');
                void modulesView.offsetWidth; // reflow
                modulesView.classList.add('active');
                // CRITICAL: Ensure opacity is 1
                modulesView.style.opacity = '1';
            }
        }, 500);
    }
}

function resetSubmodules() {
    // Query elements dynamically to ensure they exist
    const allDetailViews = document.querySelectorAll('.main-content [id$="-view"]');
    const allListContainers = [
        document.querySelector('.hero-card'),
        document.querySelector('.grid-container'), // Dashboard grid
        document.querySelector('#other-tools-view .grid-container'), // Tools grid
        document.getElementById('best-practices-list'),
        document.getElementById('maintenance-grid')
    ];

    // 1. Close all detailed views
    allDetailViews.forEach(view => {
        if (view) view.classList.add('hidden');
    });

    // 2. Show all main list containers
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
// --- Generic Video Logic (Modal Embed) ---
// --- Generic Video Logic (Modal Embed) ---
// Using Event Delegation for robustness
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-watch');
    if (btn) {
        e.preventDefault(); // Prevent default button behavior

        const videoSrc = btn.getAttribute('data-video-src');
        const videoModal = document.getElementById('video-modal');
        const modalIframe = document.getElementById('modal-iframe');

        console.log('Video button clicked:', videoSrc);

        if (videoSrc && videoModal && modalIframe) {
            // Set the iframe src to the embed URL
            modalIframe.src = videoSrc;
            // Show the modal
            videoModal.classList.add('active');
            videoModal.style.opacity = '1';
            videoModal.style.pointerEvents = 'all';
        } else {
            console.error('Video modal reference missing or invalid src');
        }
    }
});

// Close Modal Logic (Delegation)
document.addEventListener('click', (e) => {
    const videoModal = document.getElementById('video-modal');
    if (!videoModal) return;

    // Check if clicked close button OR clicked overlay (backdrop)
    const isCloseBtn = e.target.closest('#close-modal');
    const isBackdrop = e.target === videoModal;

    if (isCloseBtn || isBackdrop) {
        const modalIframe = document.getElementById('modal-iframe');

        videoModal.classList.remove('active');
        videoModal.style.opacity = '0';
        videoModal.style.pointerEvents = 'none';

        // Stop the video by clearing the src
        if (modalIframe) {
            setTimeout(() => {
                modalIframe.src = "";
            }, 300); // Wait for fade out
        }
    }
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

// TOOL SELECTION
window.selectTool = function (toolName) {
    console.log(`Tool selected: ${toolName}`);
    alert(`Módulo: ${toolName}\nConteúdo em breve!`);
}

// --- Drill / Driver Manual Navigation ---
const drillDriverView = document.getElementById('drill-driver-view');
const backFromDrillDriverBtn = document.getElementById('back-from-drill-driver');
// More specific selector to avoid conflict with dashboard grid
const otherToolsGrid = document.querySelector('#other-tools-view .grid-container');

window.openDrillDriverManual = function () {
    console.log("Opening Drill/Driver Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (drillDriverView) {
        drillDriverView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromDrillDriverBtn) {
    backFromDrillDriverBtn.addEventListener('click', () => {
        if (drillDriverView) drillDriverView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}
