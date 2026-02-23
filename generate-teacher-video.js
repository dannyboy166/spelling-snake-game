const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ID = 'sasco-project';
const DRIVE_FOLDER_ID = '1Q23m9itexQBMdzbMTKmDpk8Dzh-AUzxF';
const GCLOUD_PATH = '/opt/homebrew/share/google-cloud-sdk/bin/gcloud';

// Get word from command line
const word = process.argv[2];
if (!word) {
    console.error('Usage: node generate-teacher-video.js <WORD>');
    console.error('Example: node generate-teacher-video.js DOG');
    process.exit(1);
}

const WORD = word.toUpperCase();
const wordLower = word.toLowerCase();

console.log(`\n========================================`);
console.log(`Generating teacher video for: ${WORD}`);
console.log(`========================================\n`);

// Get access token from gcloud CLI (for Vertex AI)
function getAccessToken() {
    try {
        const token = execSync(`${GCLOUD_PATH} auth print-access-token`, { encoding: 'utf-8' }).trim();
        return token;
    } catch (error) {
        console.error('Error getting access token. Make sure you ran: gcloud auth login');
        throw error;
    }
}

// Get access token with Drive scope (from application default credentials)
function getDriveAccessToken() {
    try {
        const token = execSync(`${GCLOUD_PATH} auth application-default print-access-token`, { encoding: 'utf-8' }).trim();
        return token;
    } catch (error) {
        console.error('Error getting Drive access token. Run: gcloud auth application-default login --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.file"');
        throw error;
    }
}

async function generateVeoVideo() {
    console.log('Step 1/6: Generating video with Vertex AI Veo 3.1...');

    const accessToken = getAccessToken();
    const imagePath = path.join(__dirname, 'teacher-portrait.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const prompt = `The animated teacher character speaks to the camera and says "Spell the word ${wordLower}". She has friendly expressions and natural lip movements as she speaks slowly and clearly. She gestures gently with her hands while talking.`;

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/veo-3.1-generate-001:predictLongRunning`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [{
                prompt: prompt,
                image: {
                    bytesBase64Encoded: base64Image,
                    mimeType: 'image/jpeg'
                }
            }],
            parameters: {
                aspectRatio: '9:16',
                sampleCount: 1,
                durationSeconds: 4
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', error);
        throw new Error(`Vertex AI Veo API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('   Video generation started, polling...');
    return await pollForResult(data.name);
}

async function pollForResult(operationName) {
    const pollUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation`;

    while (true) {
        const accessToken = getAccessToken();
        const response = await fetch(pollUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ operationName: operationName })
        });

        const data = await response.json();
        process.stdout.write('.');

        if (data.done) {
            console.log(' Done!');
            if (data.error) {
                throw new Error(`Generation failed: ${JSON.stringify(data.error)}`);
            }
            return data.response;
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

function saveRawVideo(result) {
    console.log('Step 2/6: Saving raw video...');
    const videos = result.videos;
    if (videos && videos[0] && videos[0].bytesBase64Encoded) {
        const videoBuffer = Buffer.from(videos[0].bytesBase64Encoded, 'base64');
        // Save raw video with proper name (keeping green screen version)
        const rawPath = path.join(__dirname, 'assets', 'teacher-videos', `spell-${wordLower}-raw.mp4`);
        fs.writeFileSync(rawPath, videoBuffer);
        console.log(`   Saved ${rawPath}`);
        return rawPath;
    }
    throw new Error('No video in API response');
}

function applyChromakey(inputPath) {
    console.log('Step 3/6: Removing green screen...');
    const outputPath = path.join(__dirname, 'assets', 'teacher-videos', `spell-${wordLower}.webm`);

    execSync(`ffmpeg -y -i "${inputPath}" -vf "chromakey=0x00FF00:0.25:0.1" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 1M -c:a libopus "${outputPath}"`, {
        stdio: 'pipe'
    });

    // Keep raw video (don't delete)
    console.log(`   Saved ${outputPath}`);
    return outputPath;
}

async function uploadToDrive(filePath, stepNum = '4/6') {
    const fileName = path.basename(filePath);
    const isMP4 = filePath.endsWith('.mp4');
    const mimeType = isMP4 ? 'video/mp4' : 'video/webm';

    console.log(`Step ${stepNum}: Uploading ${fileName} to Google Drive...`);

    const accessToken = getDriveAccessToken();
    const fileContent = fs.readFileSync(filePath);

    // Create multipart upload
    const boundary = '-------314159265358979323846';
    const metadata = JSON.stringify({
        name: fileName,
        parents: [DRIVE_FOLDER_ID]
    });

    const multipartBody = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
        fileContent,
        Buffer.from(`\r\n--${boundary}--`)
    ]);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'x-goog-user-project': PROJECT_ID
        },
        body: multipartBody
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('   Drive upload failed:', error);
        throw new Error('Drive upload failed');
    }

    const data = await response.json();
    console.log(`   Uploaded: ${fileName} (ID: ${data.id})`);
    return data;
}

function updateVideoWords() {
    console.log('Step 6/6: Updating VIDEO_WORDS in game.js...');

    const gameJsPath = path.join(__dirname, 'js', 'game.js');
    let content = fs.readFileSync(gameJsPath, 'utf-8');

    // Find VIDEO_WORDS line
    const regex = /const VIDEO_WORDS = \[([^\]]*)\]/;
    const match = content.match(regex);

    if (match) {
        const currentWords = match[1].split(',').map(w => w.trim().replace(/'/g, '')).filter(w => w);

        if (!currentWords.includes(WORD)) {
            currentWords.push(WORD);
            currentWords.sort();
            const newList = currentWords.map(w => `'${w}'`).join(', ');
            content = content.replace(regex, `const VIDEO_WORDS = [${newList}]`);
            fs.writeFileSync(gameJsPath, content);
            console.log(`   Added '${WORD}' to VIDEO_WORDS: [${newList}]`);
        } else {
            console.log(`   '${WORD}' already in VIDEO_WORDS`);
        }
    }
}

async function main() {
    try {
        const startTime = Date.now();

        // Step 1: Generate video
        const result = await generateVeoVideo();

        // Step 2: Save raw video (with green screen)
        const rawPath = saveRawVideo(result);

        // Step 3: Apply chromakey (create transparent version)
        const finalPath = applyChromakey(rawPath);

        // Step 4: Upload raw MP4 to Drive
        await uploadToDrive(rawPath, '4/6');

        // Step 5: Upload processed WebM to Drive
        await uploadToDrive(finalPath, '5/6');

        // Step 6: Update VIDEO_WORDS
        updateVideoWords();

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n========================================`);
        console.log(`SUCCESS! Video for "${WORD}" ready in ${elapsed}s`);
        console.log(`Local files:`);
        console.log(`  - assets/teacher-videos/spell-${wordLower}-raw.mp4 (green screen)`);
        console.log(`  - assets/teacher-videos/spell-${wordLower}.webm (transparent)`);
        console.log(`Drive: Both versions uploaded`);
        console.log(`========================================\n`);

    } catch (error) {
        console.error('\nERROR:', error.message);
        process.exit(1);
    }
}

main();
