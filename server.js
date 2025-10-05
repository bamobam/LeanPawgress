import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🐾 LeanPawgress server is running at http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to the URL above to start using the app!`);
    console.log(`🎨 The UI now matches the PDF design with bright yellow background and cute cat!`);
});
