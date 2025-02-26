import csvToJson from "convert-csv-to-json"
import fs from 'fs';

const fileInputName = 'data/challenges.csv'; 
const fileOutputName = 'data/challenges.json';

const json = csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);
fs.writeFileSync(fileOutputName, JSON.stringify(json))