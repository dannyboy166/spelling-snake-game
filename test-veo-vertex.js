const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Your Google Cloud Project ID
const PROJECT_ID = 'sasco-project';  // Update if different

// Get access token from gcloud CLI
function getAccessToken() {
    try {
        const token = execSync('/opt/homebrew/share/google-cloud-sdk/bin/gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
        return token;
    } catch (error) {
        console.error('Error getting access token. Make sure you ran: gcloud auth login');
        throw error;
    }
}

async function generateVeoVideo(imagePath, prompt) {
    console.log('Generating video with Vertex AI Veo 3.1...');

    const accessToken = getAccessToken();
    console.log('Got access token');

    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Vertex AI endpoint for Veo (us-central1)
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
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error('API Error:', error);
        throw new Error(`Vertex AI Veo API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Operation started:', data.name);

    // Poll for result
    return await pollForResult(data.name);
}

async function pollForResult(operationName) {
    console.log('Polling for result...');

    // fetchPredictOperation endpoint
    const pollUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation`;

    while (true) {
        const accessToken = getAccessToken();
        console.log('Polling...');

        const response = await fetch(pollUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    operationName: operationName
                })
            }
        );

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Response not JSON:', text.substring(0, 200));
            throw new Error('Invalid response from API');
        }
        console.log('Status:', data.metadata?.state || data.done ? 'DONE' : 'PROCESSING');

        if (data.done) {
            if (data.error) {
                throw new Error(`Generation failed: ${JSON.stringify(data.error)}`);
            }
            return data.response;
        }

        // Wait 5 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function downloadVideo(url, outputPath) {
    console.log('Downloading video from:', url);
    const accessToken = getAccessToken();
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Download failed: ${error}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log('Video saved to:', outputPath);
}

async function main() {
    try {
        const imagePath = path.join(__dirname, 'teacher-portrait.jpg');

        // Prompt describing how to animate the image
        const prompt = `The animated teacher character speaks to the camera and says "Spell the word ant". She has friendly expressions and natural lip movements as she speaks slowly and clearly. She gestures gently with her hands while talking.`;

        const result = await generateVeoVideo(imagePath, prompt);
        console.log('Result:', JSON.stringify(result, null, 2));

        // Extract video from Vertex AI response format
        // Vertex AI returns: { videos: [{ bytesBase64Encoded: "..." }] }
        const videos = result.videos;
        if (videos && videos[0] && videos[0].bytesBase64Encoded) {
            const videoBuffer = Buffer.from(videos[0].bytesBase64Encoded, 'base64');
            fs.writeFileSync(path.join(__dirname, 'teacher-veo.mp4'), videoBuffer);
            console.log('\n✅ Success! Video saved as teacher-veo.mp4');
        } else {
            console.log('No video in result. Full response:', JSON.stringify(result, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
