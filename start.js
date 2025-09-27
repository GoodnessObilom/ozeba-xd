const { exec } = require('child_process');
const fs = require('fs');

// The main file of your bot
const MAIN_FILE = 'index.js'; 
const APP_NAME = 'OZEBA-XD'; // Your application name

// Check if we are in a container/environment where PM2 is unnecessary 
// (e.g., Heroku, or a robust Docker environment like Pterodactyl/Wings)
// Heroku provides a PORT env var automatically.
if (process.env.NODE_ENV === 'production' && process.env.PORT) {
    // Environment is likely Heroku or similar robust container.
    // Run the main file directly. The container runtime will handle reboots.
    console.log(`[STARTUP] Detected Heroku/Container environment. Running ${MAIN_FILE} directly.`);
    require(`./${MAIN_FILE}`);
} else if (fs.existsSync('ecosystem.config.js')) {
    // Environment is likely a local server or a Pterodactyl server expecting PM2
    // Run via PM2.
    console.log('[STARTUP] Detected PM2 config. Starting via PM2.');
    
    // Execute PM2 start command in a new process
    const pm2 = exec(`pm2 start ecosystem.config.js --name ${APP_NAME} --no-daemon`);
    
    pm2.stdout.on('data', (data) => {
        console.log(`[PM2] ${data.trim()}`);
    });
    
    pm2.stderr.on('data', (data) => {
        console.error(`[PM2 ERROR] ${data.trim()}`);
    });

} else {
    // Default fallback: Run the main file directly
    console.log(`[STARTUP] Default fallback. Running ${MAIN_FILE} directly.`);
    require(`./${MAIN_FILE}`);
}
