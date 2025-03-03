const awards = [
    { name: "Designer of the Year", type: "Nominee", project: "VISION 2024", label: "Awwwards" },
    { name: "Best UI Design", type: "Winner", project: "PIXELPRO", label: "CSSDA" },
    { name: "Top Freelancer", type: "Finalist", project: "FREELANCE X", label: "Dribbble" },
    { name: "Most Innovative", type: "Winner", project: "CREATIVE HUB", label: "Webflow" },
    { name: "Best Portfolio", type: "Nominee", project: "SHOWCASE 2024", label: "Behance" },
    { name: "Breakthrough Star", type: "Finalist", project: "NEXTGEN", label: "Awwwards" },
    { name: "E-Com Award", type: "Winner", project: "SHOPFLY", label: "Shopify" },
    { name: "Best Animation", type: "Nominee", project: "MOTIONX", label: "CSSDA" },
    { name: "Site of the Month", type: "Winner", project: "LAUNCHPAD", label: "Webflow" },
    { name: "Creative Coder", type: "Finalist", project: "CODEVERSE", label: "CodePen" }
];






document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        autoRef: true,
    });
});

const awardsListContainer = document.querySelector(".awards-list");
const awardPreview = document.querySelector(".award-preview");
const awardsList = document.querySelector(".awards-list");

const POSITIONS = {
    BOTTOM: 0,
    MIDDLE: -80,
    TOP: -160,
};

let lastMousePosition = { x: 0, y: 0 };
let activeAwards = null;
let ticking = false;
let mouseTimeout = null;
let isMouseMoving = false;

awards.forEach((award) => {
    const awardElement = document.createElement("div");
    awardElement.className = "award";

    awardElement.innerHTML = `
        <div class="award-wrapper">
            <div class="award-name">
                <h1>${award.name}</h1>
                <h1>${award.type}</h1>
            </div>
            <div class="award-project">
                <h1>${award.project}</h1>
                <h1>${award.label}</h1>
            </div>
            <div class="award-name">
                <h1>${award.name}</h1>
                <h1>${award.type}</h1>
            </div>
        </div>
    `;

    awardsListContainer.appendChild(awardElement);
});

const awardsElements = document.querySelectorAll(".award");

const animatePreview = () => {
    const awardsListRect = awardsList.getBoundingClientRect();
    if (
        lastMousePosition.x < awardsListRect.left ||
        lastMousePosition.x > awardsListRect.right ||
        lastMousePosition.y < awardsListRect.top ||
        lastMousePosition.y > awardsListRect.bottom
    ) {
        const previewImages = awardPreview.querySelectorAll("img");
        previewImages.forEach((img) => {
            gsap.to(img, {
                scale: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => img.remove(),
            });
        });
    }
};

const updateAwards = () => {
    animatePreview();

    if (activeAwards) {
        const rect = activeAwards.getBoundingClientRect();
        const isStillOver =
            lastMousePosition.x >= rect.left &&
            lastMousePosition.x <= rect.right &&
            lastMousePosition.y >= rect.top &&
            lastMousePosition.y <= rect.bottom;

        if (isStillOver) {
            const wrapper = activeAwards.querySelector(".award-wrapper");
            const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2;

            gsap.to(wrapper, {
                y: leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM,
                duration: 0.4,
                ease: "power2.out",
            });
            activeAwards = null;
        }
    }

    awardsElements.forEach(function (award, index) {
        if (award === activeAwards) return;

        const rect = award.getBoundingClientRect();
        const isMouseOver =
            lastMousePosition.x >= rect.left &&
            lastMousePosition.x <= rect.right &&
            lastMousePosition.y >= rect.top &&
            lastMousePosition.y <= rect.bottom;

        if (isMouseOver) {
            const wrapper = award.querySelector(".award-wrapper");
            const enterFromTop = lastMousePosition.y < rect.top + rect.height / 2;


            gsap.to(wrapper, {
                y: POSITIONS.MIDDLE,
                duration: 0.4,
                ease: "power2.out",
            });
            activeAwards = award;
        }
    });

    ticking = false;
};

document.addEventListener("mousemove", (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY; // Fixed typo

    isMouseMoving = true;
    if (mouseTimeout){
        clearTimeout(mouseTimeout);
    };

    const awardsListRect = awardsList.getBoundingClientRect();
    const isInsideAwardsList =
        lastMousePosition.x >= awardsListRect.left &&
        lastMousePosition.x <= awardsListRect.right &&
        lastMousePosition.y >= awardsListRect.top &&
        lastMousePosition.y <= awardsListRect.bottom;

    if (isInsideAwardsList) {
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
            const images = awardPreview.querySelectorAll("img");
            if (images.length > 1) {
                const lastImage = images[images.length - 1];
                images.forEach((img) => {
                    if (img !== lastImage) {
                        gsap.to(img, {
                            scale: 0,
                            duration: 0.4,
                            ease: "power2.out",
                            onComplete: () => img.remove(),
                        });
                    }
                });
            }
        }, 2000);
    }
    animatePreview();
});

document.addEventListener(
    "scroll",
    () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateAwards();
            });
            ticking = true;
        }
    },
    { passive: true }
);

awardsElements.forEach((award, index) => {
    const wrapper = award.querySelector(".award-wrapper");
    let currentPosition = POSITIONS.TOP;

    award.addEventListener("mouseenter", (e) => {
        activeAwards = award;
        const rect = award.getBoundingClientRect();
        const enterFromTop = e.clientY < rect.top + rect.height / 2;

        if (enterFromTop || currentPosition === POSITIONS.BOTTOM) {
            currentPosition = POSITIONS.MIDDLE;
            gsap.to(wrapper, {
                y: POSITIONS.MIDDLE,
                duration: 0.4,
                ease: "power2.out",
            });
        }

        const img = document.createElement("img");
        img.src = `images/img${index + 1}.jpg`;
        img.style.position = "absolute";
        img.style.top = 0;
        img.style.left = 0;
        img.style.scale = 0;
        img.style.zIndex = Date.now();

        awardPreview.appendChild(img); // Fixed typo (comma → dot)

        gsap.to(img, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
        });
    });

    award.addEventListener("mouseleave", (e) => {
        activeAwards = null;
        const rect = award.getBoundingClientRect();
        const leavingFromTop = e.clientY < rect.top + rect.height / 2;

        currentPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM;
        gsap.to(wrapper, {
            y: currentPosition,
            duration: 0.4,
            ease: "power2.out",
        });
    });
});
