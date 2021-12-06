import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to: localhost:${port}`));
app.use(express.static('public'));

app.get('/getData/:requestedData', async (req, resp) => {
    const requestedData = req.params.requestedData;

    switch (requestedData) {
        case 'playerHistory':
            var data = await getSpreadsheetData('Data!A4:A');
            break;
        case 'staffHistory':
            var data = await getSpreadsheetData('Data!AS4:AS');
            break;
        case 'banners':
            var data = await getSpreadsheetData('Data!BG4:BG');
            break;
    }

    resp.send(data);
});

const convert2dArray = arr => arr.concat(... arr).filter(value => !Array.isArray(value));

async function getSpreadsheetData(range) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });
    
    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });

    const getData = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: process.env.SPREADSHEET_ID,
        range
    });

    const data = convert2dArray(getData.data.values)
    .filter(value => value.length == 0 || value !== '')
    .map(str => JSON.parse(str));

    return data;
}