document.addEventListener("DOMContentLoaded", () => {
    const textContainer = document.getElementById("text-container");
    const sparkleContainer = document.getElementById("sparkle-container");
    const backgroundAudio = document.getElementById("backgroundAudio");
    let audioPlayed = false;

    const messages = ["Love truc quynh", "anh yeu em", "chuc em 1/6 vui ve"];

    const colors = ["white", "pink"];
    const isMobile = window.innerWidth < 768;

    // --- AUDIO ---
    function playAudioOnInteraction() {
        if (backgroundAudio && !audioPlayed) {
            backgroundAudio
                .play()
                .then(() => {
                    audioPlayed = true;
                    document.removeEventListener(
                        "touchstart",
                        playAudioOnInteraction
                    );
                    document.removeEventListener(
                        "click",
                        playAudioOnInteraction
                    );
                })
                .catch((error) => {
                    console.error("Lỗi phát âm thanh:", error);
                });
        }
    }
    document.addEventListener("touchstart", playAudioOnInteraction, {
        once: true,
        passive: true,
    });
    document.addEventListener("click", playAudioOnInteraction, { once: true });

    // --- SPARKLES (Ngôi sao nền) ---
    function createSparkle(options) {
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        const size = Math.random() * options.maxSize + options.minSize;
        sparkle.style.width = size + "px";
        sparkle.style.height = size + "px";
        sparkle.style.top = Math.random() * 100 + "%";
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.animationDuration =
            Math.random() * options.animDurationRange +
            options.animBaseDuration +
            "s";
        sparkle.style.animationDelay =
            Math.random() * options.animBaseDuration + "s";
        sparkleContainer.appendChild(sparkle);
    }

    function initSparkles() {
        const sparkleOptions = {
            count: isMobile ? 70 : 120,
            minSize: 1,
            maxSize: 2,
            animBaseDuration: 1.2,
            animDurationRange: 1.5,
        };
        for (let i = 0; i < sparkleOptions.count; i++)
            createSparkle(sparkleOptions);

        // --- Sao băng (SHOOTING STAR) MỚI ---
        setInterval(
            () => {
                const starElement = document.createElement("div");
                starElement.classList.add("shooting-star");

                const tailLength = Math.random() * 100 + 80; // Độ dài đuôi từ 80px đến 180px
                const durationSec = Math.random() * 2.5 + 3.5; // Thời gian bay CHẬM: 3.5s đến 6.0s

                starElement.style.setProperty(
                    "--shooting-star-length",
                    `${tailLength}px`
                );
                starElement.style.animationDuration = `${durationSec}s`;
                starElement.style.setProperty(
                    "--shooting-star-duration",
                    `${durationSec}s`
                );

                let startX, startY, endX, endY;
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const travelDistance =
                    screenHeight * (0.7 + Math.random() * 0.3);

                // Ngẫu nhiên vị trí bắt đầu từ các cạnh
                const side = Math.floor(Math.random() * 4);
                let initialAngleDeg; // Góc ban đầu để tính toán điểm cuối

                switch (side) {
                    case 0: // Top
                        startX = Math.random() * screenWidth;
                        startY = -tailLength;
                        initialAngleDeg = Math.random() * 60 + 150; // Hướng xuống (150-210 độ)
                        endX =
                            startX +
                            travelDistance *
                                Math.cos((initialAngleDeg * Math.PI) / 180);
                        endY =
                            startY +
                            travelDistance *
                                Math.sin((initialAngleDeg * Math.PI) / 180);
                        break;
                    case 1: // Right
                        startX = screenWidth + tailLength;
                        startY = Math.random() * screenHeight;
                        initialAngleDeg = Math.random() * 60 + 240; // Hướng sang trái (240-300 độ)
                        endX =
                            startX +
                            travelDistance *
                                Math.cos((initialAngleDeg * Math.PI) / 180);
                        endY =
                            startY +
                            travelDistance *
                                Math.sin((initialAngleDeg * Math.PI) / 180);
                        break;
                    case 2: // Bottom (ít thấy hơn, bay lên)
                        startX = Math.random() * screenWidth;
                        startY = screenHeight + tailLength;
                        initialAngleDeg = Math.random() * 60 - 120; // Hướng lên (-120 đến -60 độ)
                        endX =
                            startX +
                            travelDistance *
                                Math.cos((initialAngleDeg * Math.PI) / 180);
                        endY =
                            startY +
                            travelDistance *
                                Math.sin((initialAngleDeg * Math.PI) / 180);
                        break;
                    default: // Left
                        startX = -tailLength;
                        startY = Math.random() * screenHeight;
                        initialAngleDeg = Math.random() * 60 - 30; // Hướng sang phải (-30 đến 30 độ)
                        endX =
                            startX +
                            travelDistance *
                                Math.cos((initialAngleDeg * Math.PI) / 180);
                        endY =
                            startY +
                            travelDistance *
                                Math.sin((initialAngleDeg * Math.PI) / 180);
                        break;
                }

                const actualAngleRad = Math.atan2(endY - startY, endX - startX);
                const actualAngleDeg = (actualAngleRad * 180) / Math.PI + 90; // +90 vì đuôi theo trục Y của div
                starElement.style.setProperty(
                    "--angle",
                    `${actualAngleDeg}deg`
                );

                starElement.style.setProperty("--start-x", `${startX}px`);
                starElement.style.setProperty("--start-y", `${startY}px`);
                starElement.style.setProperty("--end-x", `${endX}px`);
                starElement.style.setProperty("--end-y", `${endY}px`);

                sparkleContainer.appendChild(starElement);
                setTimeout(() => {
                    if (sparkleContainer.contains(starElement)) {
                        sparkleContainer.removeChild(starElement);
                    }
                }, durationSec * 1000 + 200);
            },
            isMobile ? 2000 : 2500
        );
    }

    // --- FALLING TEXT/HEART ---
    function createFallingElement(type, options) {
        const el = document.createElement("div");
        el.style.left = `${
            Math.random() * options.horizontalRange.range +
            options.horizontalRange.offset
        }vw`;

        const z = Math.random() * options.zRange - options.zRange / 2;
        el.style.setProperty("--initial-z-transform", `translateZ(${z}px)`);

        let fontSizeValue = 20;
        let unit = "px";

        if (type === "text") {
            el.classList.add("falling-text");
            el.textContent =
                messages[Math.floor(Math.random() * messages.length)];
            const colorClass =
                colors[Math.floor(Math.random() * colors.length)];
            if (colorClass !== "white") el.classList.add(colorClass);
            const fontSizeStr = options.fontSize();
            fontSizeValue = parseFloat(fontSizeStr);
            unit = fontSizeStr.match(/[a-z%]+/g)[0];
        } else {
            // heart
            el.classList.add("falling-heart");
            el.textContent = "❤️";
            const heartSizeStr = options.heartSize();
            fontSizeValue = parseFloat(heartSizeStr);
            unit = heartSizeStr.match(/[a-z%]+/g)[0];
        }

        const scale =
            options.depthScale.min +
            (options.depthScale.max - options.depthScale.min) *
                ((z + options.zRange / 2) / options.zRange);
        el.style.fontSize = (fontSizeValue * scale).toFixed(2) + unit;

        const duration =
            Math.random() * options.durationRange.random +
            options.durationRange.base;
        const delay = Math.random() * options.delayRange;
        el.style.setProperty("--fall-duration", duration + "s");
        el.style.setProperty("--fall-delay", delay + "s");

        textContainer.appendChild(el);
    }

    // --- ROTATION ---
    function setupRotation(target, maxRotateDeg) {
        let rx = 0,
            ry = 0;
        let animationFrameRequested = false;

        function animate() {
            target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
            animationFrameRequested = false;
        }

        function requestAnimation() {
            if (!animationFrameRequested) {
                requestAnimationFrame(animate);
                animationFrameRequested = true;
            }
        }

        if (isMobile) {
            document.addEventListener(
                "touchmove",
                (e) => {
                    if (e.touches.length === 1) {
                        const x = e.touches[0].clientX;
                        const y = e.touches[0].clientY;
                        const px =
                            (x - window.innerWidth / 2) /
                            (window.innerWidth / 2);
                        const py =
                            (y - window.innerHeight / 2) /
                            (window.innerHeight / 2);
                        ry = px * maxRotateDeg;
                        rx = -py * maxRotateDeg;
                        requestAnimation();
                    }
                },
                { passive: true }
            );
        } else {
            document.addEventListener("mousemove", (e) => {
                const px =
                    (e.clientX - window.innerWidth / 2) /
                    (window.innerWidth / 2);
                const py =
                    (e.clientY - window.innerHeight / 2) /
                    (window.innerHeight / 2);
                ry = px * maxRotateDeg;
                rx = -py * maxRotateDeg;
                requestAnimation();
            });
            document.addEventListener("mouseleave", () => {
                rx = 0;
                ry = 0;
                requestAnimation();
            });
        }
        requestAnimation(); // Initial call
    }

    // --- SETTINGS ---
    const opts = isMobile
        ? {
              // Mobile options
              fontSize: () => 2.6 + Math.random() * 1.4 + "vmin",
              heartSize: () => 2.8 + Math.random() * 1.2 + "vmin",
              zRange: 650,
              depthScale: { min: 1.5, max: 2 },
              durationRange: { base: 4, random: 5 },
              creationIntervalTime: { text: 800, heart: 1200 },
              delayRange: 2,
              initialCount: { text: 10, heart: 3 },
              maxRotateDeg: 22,
              horizontalRange: { range: 180, offset: -40 },
          }
        : {
              // Desktop options
              fontSize: () => Math.random() * 10 + 18 + "px",
              heartSize: () => Math.random() * 10 + 22 + "px",
              zRange: 800,
              depthScale: { min: 1.5, max: 3 },
              durationRange: { base: 25, random: 10 },
              creationIntervalTime: { text: 2000, heart: 3500 },
              delayRange: 10,
              initialCount: { text: 10, heart: 4 },
              maxRotateDeg: 15,
              horizontalRange: { range: 100, offset: -5 },
          };

    // --- Khởi tạo ---
    initSparkles();
    for (let i = 0; i < opts.initialCount.text; i++)
        createFallingElement("text", opts);
    for (let i = 0; i < opts.initialCount.heart; i++)
        createFallingElement("heart", opts);
    setInterval(
        () => createFallingElement("text", opts),
        opts.creationIntervalTime.text
    );
    setInterval(
        () => createFallingElement("heart", opts),
        opts.creationIntervalTime.heart
    );
    setupRotation(textContainer, opts.maxRotateDeg);
});
