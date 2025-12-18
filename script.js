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

// --- Session Management ---
const SESSION_KEY = 'espazie_session';

function saveSession(data) {
    const currentSession = loadSession() || {};
    const newSession = { ...currentSession, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
}

function loadSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

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
    // Save Session
    saveSession({ isLoggedIn: true, view: 'modules-view' });

    // Hide Login
    loginView.style.opacity = '0';

    setTimeout(() => {
        loginView.classList.remove('active');
        loginView.classList.add('hidden');

        // Show Module Selection instead of Dashboard directly
        if (modulesView) {
            modulesView.classList.remove('hidden');
            void modulesView.offsetWidth; // trigger reflow
            modulesView.classList.add('active'); // CRTICAL: Enable pointer events
            modulesView.style.opacity = '1';
        }
    }, 500);
}

// 2. LOGOUT - GLOBAL FUNCTION
window.performLogout = function () {
    console.log("Global Logout Triggered");
    clearSession();

    // Determine which view is active to hide it
    const dashboardView = document.getElementById('dashboard-view');
    const modulesView = document.getElementById('modules-view');
    const otherToolsView = document.getElementById('other-tools-view');
    const loginView = document.getElementById('login-view');
    const loginForm = document.getElementById('login-form');

    let activeView = null;
    if (dashboardView && dashboardView.classList.contains('active')) activeView = dashboardView;
    else if (modulesView && !modulesView.classList.contains('hidden')) activeView = modulesView;
    else if (otherToolsView && otherToolsView.classList.contains('active')) activeView = otherToolsView;

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
        if (otherToolsView) {
            otherToolsView.classList.add('hidden');
            otherToolsView.classList.remove('active');
            otherToolsView.style.opacity = '0';
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

// 3. INITIALIZATION (Check Session)
document.addEventListener('DOMContentLoaded', () => {
    // Re-select elements inside ensure they exist
    const modulesView = document.getElementById('modules-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginView = document.getElementById('login-view');
    const otherToolsView = document.getElementById('other-tools-view');

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Check for saved session
    const session = loadSession();
    if (session && session.isLoggedIn) {
        console.log("Restoring session:", session);

        // Hide Login Immediately
        if (loginView) {
            loginView.classList.add('hidden');
            loginView.classList.remove('active');
            loginView.style.opacity = '0';
        }

        // Restore View
        if (session.view === 'dashboard-view') {
            if (dashboardView) {
                dashboardView.classList.remove('hidden');
                dashboardView.classList.add('active');
                dashboardView.style.opacity = '1';

                // Restore Tab if exists
                if (session.tab && typeof switchTab === 'function') {
                    switchTab(session.tab);
                } else if (typeof switchTab === 'function') {
                    switchTab('how-to-use'); // Default
                }
            }
        } else if (session.view === 'other-tools-view') {
            if (otherToolsView) {
                otherToolsView.classList.remove('hidden');
                otherToolsView.classList.add('active');
                otherToolsView.style.opacity = '1';
                // Explicitly unhide grid if generic restore
                const grid = otherToolsView.querySelector('.grid-container');
                if (grid) grid.classList.remove('hidden');
            }
        } else {
            // Default to Modules View
            if (modulesView) {
                modulesView.classList.remove('hidden');
                modulesView.classList.add('active');
                modulesView.style.opacity = '1';
            }
        }
    } else {
        // No session, ensure login is visible
        if (loginView) {
            loginView.classList.remove('hidden');
            loginView.classList.add('active');
            loginView.style.opacity = '1';
        }
    }
});


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

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

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
    console.log("Opening Other Tools Module - v5.11"); // Version Log
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
        // Don't override tab if we are just navigating to dashboard
        // But do save the view
        saveSession({ view: viewId });
    } else {
        saveSession({ view: viewId });
    }
}

// GLOBAL FUNCTION to Go Back to Modules
window.backToModules = function () {
    console.log("Back to Modules Triggered");

    const dashboardView = document.getElementById('dashboard-view');
    const otherToolsView = document.getElementById('other-tools-view');
    const modulesView = document.getElementById('modules-view');

    // Helper to hide a view
    const hideView = (view) => {
        if (view && view.classList.contains('active')) {
            view.style.opacity = '0';
            view.classList.remove('active');
            setTimeout(() => {
                view.classList.add('hidden');
            }, 500);
        }
    };

    hideView(dashboardView);
    hideView(otherToolsView);

    // Show Modules View
    setTimeout(() => {
        if (modulesView) {
            modulesView.classList.remove('hidden');
            void modulesView.offsetWidth; // reflow
            modulesView.classList.add('active');
            modulesView.style.opacity = '1';

            // Save Session State
            saveSession({ view: 'modules-view', tab: null });
        }
    }, 500);
}

function resetSubmodules() {
    // Query elements dynamically to ensure they exist
    const allDetailViews = document.querySelectorAll('.main-content [id$="-view"]');

    // Select ALL container types that act as main lists
    const allListContainers = document.querySelectorAll(
        '.hero-card, .grid-container, .list-card, .info-grid'
    );

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

    // Save Tab State
    saveSession({ tab: tabId });

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

// --- Rotary Hammer Manual Navigation ---
const rotaryHammerView = document.getElementById('rotary-hammer-view');
const backFromRotaryHammerBtn = document.getElementById('back-from-rotary-hammer');

window.openRotaryHammerManual = function () {
    console.log("Opening Rotary Hammer Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (rotaryHammerView) {
        rotaryHammerView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromRotaryHammerBtn) {
    backFromRotaryHammerBtn.addEventListener('click', () => {
        if (rotaryHammerView) rotaryHammerView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Circular Saw Manual Navigation ---
const circularSawView = document.getElementById('circular-saw-view');
const backFromCircularSawBtn = document.getElementById('back-from-circular-saw');

window.openCircularSawManual = function () {
    console.log("Opening Circular Saw Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (circularSawView) {
        circularSawView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromCircularSawBtn) {
    backFromCircularSawBtn.addEventListener('click', () => {
        if (circularSawView) circularSawView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Jigsaw Manual Navigation ---
const jigsawView = document.getElementById('jigsaw-view');
const backFromJigsawBtn = document.getElementById('back-from-jigsaw');

window.openJigsawManual = function () {
    console.log("Opening Jigsaw Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (jigsawView) {
        jigsawView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromJigsawBtn) {
    backFromJigsawBtn.addEventListener('click', () => {
        if (jigsawView) jigsawView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Angle Grinder Manual Navigation ---
const angleGrinderView = document.getElementById('angle-grinder-view');
const backFromAngleGrinderBtn = document.getElementById('back-from-angle-grinder');

window.openAngleGrinderManual = function () {
    console.log("Opening Angle Grinder Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (angleGrinderView) {
        angleGrinderView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromAngleGrinderBtn) {
    backFromAngleGrinderBtn.addEventListener('click', () => {
        if (angleGrinderView) angleGrinderView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Oscillating Multi-Tool Manual Navigation ---
const oscillatingMultiToolView = document.getElementById('oscillating-multi-tool-view');
const backFromOscillatingMultiToolBtn = document.getElementById('back-from-oscillating-multi-tool');

window.openOscillatingMultiToolManual = function () {
    console.log("Opening Oscillating Multi-Tool Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (oscillatingMultiToolView) {
        oscillatingMultiToolView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromOscillatingMultiToolBtn) {
    backFromOscillatingMultiToolBtn.addEventListener('click', () => {
        if (oscillatingMultiToolView) oscillatingMultiToolView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Orbital Sander Manual Navigation ---
const orbitalSanderView = document.getElementById('orbital-sander-view');
const backFromOrbitalSanderBtn = document.getElementById('back-from-orbital-sander');

window.openOrbitalSanderManual = function () {
    console.log("Opening Orbital Sander Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (orbitalSanderView) {
        orbitalSanderView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromOrbitalSanderBtn) {
    backFromOrbitalSanderBtn.addEventListener('click', () => {
        if (orbitalSanderView) orbitalSanderView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Electric Planer Manual Navigation ---
const electricPlanerView = document.getElementById('electric-planer-view');
const backFromElectricPlanerBtn = document.getElementById('back-from-electric-planer');

window.openElectricPlanerManual = function () {
    console.log("Opening Electric Planer Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (electricPlanerView) {
        electricPlanerView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromElectricPlanerBtn) {
    backFromElectricPlanerBtn.addEventListener('click', () => {
        if (electricPlanerView) electricPlanerView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}

// --- Reciprocating Saw Manual Navigation ---
const reciprocatingSawView = document.getElementById('reciprocating-saw-view');
const backFromReciprocatingSawBtn = document.getElementById('back-from-reciprocating-saw');

window.openReciprocatingSawManual = function () {
    console.log("Opening Reciprocating Saw Manual");
    if (otherToolsGrid) otherToolsGrid.classList.add('hidden');
    if (reciprocatingSawView) {
        reciprocatingSawView.classList.remove('hidden');
        // Scroll to top of main content
        const mainContent = document.querySelector('#other-tools-view .main-content');
        if (mainContent) mainContent.scrollTop = 0;
    }
}

if (backFromReciprocatingSawBtn) {
    backFromReciprocatingSawBtn.addEventListener('click', () => {
        if (reciprocatingSawView) reciprocatingSawView.classList.add('hidden');
        if (otherToolsGrid) otherToolsGrid.classList.remove('hidden');
    });
}
