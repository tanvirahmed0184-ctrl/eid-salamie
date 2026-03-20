// /* script.js */
// const canvas = document.getElementById("wheel");
// const ctx = canvas.getContext("2d");
// const spinBtn = document.getElementById("spin-btn");
// const namesInput = document.getElementById("names");
// const winnerText = document.getElementById("winner-announcement");
// const ssBtn = document.getElementById("ss-btn");
// const salamiBtn = document.getElementById("salami-diba-btn");

// // Panel references
// const creatorPanel = document.getElementById("creator-view-panel");
// const advancedPanel = document.getElementById("advanced-toggle-panel");
// const shareArea = document.getElementById("share-area");
// const shareInput = document.getElementById("share-link-input");

// // Advanced inputs
// const colorsInput = [
//     document.getElementById("color1"),
//     document.getElementById("color2"),
//     document.getElementById("color3")
// ];
// const speedInput = document.getElementById("spin-speed");
// const confettiInput = document.getElementById("disable-confetti");

// let names = [];
// let currentRotation = 0;
// let userWheelConfig = null; // Stores configuration loaded from shared link

// // 4. URL/MODE Logic: Check if we are viewing a shared wheel
// const urlParams = new URLSearchParams(window.location.search);
// const sharedWheelId = urlParams.get('wheel');

// // Initialize view based on URL
// function initView() {
//     if (sharedWheelId) {
//         // Visitor View: Load the configuration
//         loadSharedConfig(sharedWheelId);
//         creatorPanel.style.display = 'none'; // Hide creator controls
//         salamiBtn.innerText = "Make Your Own Wheel!"; // Change cute button
//     } else {
//         // Creator View: Show controls, hide shared-only elements
//         creatorPanel.style.display = 'flex';
//         salamiBtn.innerText = "সালামি দিবা?"; // Initial cute text
//         drawWheel(); // Draw default wheel
//     }
// }

// // Draw the wheel using names and colors
// function drawWheel(itemsSource = null) {
//     if (!itemsSource) {
//         names = namesInput.value.split('\n').map(n => n.trim()).filter(n => n);
//     } else {
//         names = itemsSource;
//     }
    
//     if(names.length === 0) names = ["Add Names!"];
    
//     // 2. Use Advanced colors
//     const activeColors = colorsInput.map(input => input.value);
    
//     const numSlices = names.length;
//     const sliceAngle = (2 * Math.PI) / numSlices;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     for (let i = 0; i < numSlices; i++) {
//         const startAngle = i * sliceAngle;
//         const endAngle = startAngle + sliceAngle;
        
//         ctx.beginPath();
//         ctx.moveTo(250, 250);
//         ctx.arc(250, 250, 250, startAngle, endAngle);
//         ctx.fillStyle = activeColors[i % activeColors.length];
//         ctx.fill();
//         ctx.stroke();

//         // Draw Text
//         ctx.save();
//         ctx.translate(250, 250);
//         ctx.rotate(startAngle + sliceAngle / 2);
//         ctx.textAlign = "right";
//         ctx.fillStyle = "#fff";
//         ctx.font = "bold 24px Poppins";
//         ctx.shadowColor = "rgba(0,0,0,0.5)";
//         ctx.shadowBlur = 4;
        
//         // Truncate long names for the wheel
//         let displayName = names[i];
//         if (displayName.length > 15) displayName = displayName.substring(0,12) + "...";
//         ctx.fillText(displayName, 220, 10);
//         ctx.restore();
//     }
// }

// // Event listeners for Creator input
// namesInput.addEventListener('input', () => drawWheel());
// colorsInput.forEach(input => input.addEventListener('input', () => drawWheel()));

// // 2. Toggle Advanced Options
// document.getElementById("toggle-advanced").addEventListener('click', () => {
//     advancedPanel.style.display = (advancedPanel.style.display === 'none' || advancedPanel.style.display === '') ? 'block' : 'none';
// });

// // 5. Cute Button Click Logic
// salamiBtn.addEventListener('click', () => {
//     if (sharedWheelId) {
//         // Visitor: Redirect to main creator page
//         window.location.href = window.location.origin + window.location.pathname;
//     } else {
//         // Creator: Toggle Advanced options (same as advanced toggle button)
//         advancedPanel.style.display = (advancedPanel.style.display === 'none' || advancedPanel.style.display === '') ? 'block' : 'none';
//         creatorPanel.scrollIntoView({ behavior: 'smooth' }); // Scroll down to settings
//     }
// });

// // Spin Logic
// spinBtn.addEventListener("click", () => {
//     if(names.length === 0) return;
//     winnerText.innerText = "Spinning...";
//     spinBtn.disabled = true;
//     ssBtn.className = "hidden"; // Hide SS button during spin

//     // 2. Calculate rotation based on advanced speed
//     const speedFactor = parseInt(speedInput.value) || 5; 
//     const spins = Math.floor(Math.random() * (speedFactor + 3)) + 5; 
//     const randomDegree = Math.floor(Math.random() * 360);
//     currentRotation += (spins * 360) + randomDegree;
    
//     canvas.style.transform = `rotate(${currentRotation}deg)`;

//     // Wait for animation to finish (5 seconds)
//     setTimeout(() => {
//         spinBtn.disabled = false;
//         ssBtn.className = "pill-btn"; // Show SS button
        
//         // Calculate winner
//         const actualRotation = currentRotation % 360;
//         const normalizedRotation = (360 - actualRotation + 270) % 360;
//         const sliceAngle = 360 / names.length;
//         const winningIndex = Math.floor(normalizedRotation / sliceAngle);
        
//         winnerText.innerText = `🎉 ${names[winningIndex]}! 🎉`;
        
//         // Fire Confetti (unless disabled in advanced)
//         if (!confettiInput.checked) {
//             confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
//         }
        
//     }, 5000);
// });

// // 4. Generate Share Link (Saving config to LocalStorage for this simple version)
// document.getElementById("generate-link-btn").addEventListener('click', () => {
//     // 1. Collect configuration
//     const config = {
//         n: names,
//         c: colorsInput.map(i => i.value),
//         s: speedInput.value,
//         cf: confettiInput.checked
//     };
    
//     // 2. Save config in LocalStorage with a unique ID
//     const uniqueId = 'wheel_' + Date.now();
//     localStorage.setItem(uniqueId, JSON.stringify(config));
    
//     // 3. Generate Link (points to the same page with the ID param)
//     const shareLink = `${window.location.origin}${window.location.pathname}?wheel=${uniqueId}`;
//     shareInput.value = shareLink;
//     shareArea.style.display = 'block';
//     shareInput.select();
//     alert("Share link generated! Share this URL with your friends.");
// });

// // Visitor View: Load config from LocalStorage
// function loadSharedConfig(configId) {
//     const savedConfigString = localStorage.getItem(configId);
//     if (savedConfigString) {
//         userWheelConfig = JSON.parse(savedConfigString);
        
//         // Apply configuration to hidden inputs (so drawWheel works)
//         // Note: Visitors can't see these panels, but the script needs the values.
//         namesInput.value = userWheelConfig.n.join('\n'); // Not used directly, but good practice
//         userWheelConfig.c.forEach((color, i) => colorsInput[i].value = color);
//         speedInput.value = userWheelConfig.s;
//         confettiInput.checked = userWheelConfig.cf;
        
//         // Draw the wheel using loaded names
//         drawWheel(userWheelConfig.n);
//     } else {
//         winnerText.innerText = "Error: Wheel config not found.";
//         spinBtn.disabled = true;
//     }
// }

// // 6. Screenshot (SS) and Download
// ssBtn.addEventListener('click', () => {
//     // Hide buttons before capture
//     spinBtn.style.display = 'none';
//     ssBtn.style.display = 'none';
//     salamiBtn.style.display = 'none';

//     html2canvas(document.getElementById('wheel-capture-area')).then(canvas => {
//         const imgData = canvas.toDataURL("image/png");
        
//         // Display in modal
//         document.getElementById('ss-image').src = imgData;
//         document.getElementById('ss-modal').style.display = 'flex';

//         // Show buttons again
//         spinBtn.style.display = 'inline-flex';
//         ssBtn.style.display = 'inline-flex';
//         salamiBtn.style.display = 'inline-block';
//     });
// });

// // Close SS modal
// document.getElementById('close-ss').addEventListener('click', () => {
//     document.getElementById('ss-modal').style.display = 'none';
// });

// // Start the app
// initView();