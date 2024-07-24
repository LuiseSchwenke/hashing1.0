
import { md5 } from './md5.js';
import { sha1 } from './sha1.js';
import { sha256, sha512 } from './sha2.js';

import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('hashingInterface.ejs', { encoded: null });
});

app.post('/hash', async (req, res) => {
    const number = req.body.inputField;

    if (number !== undefined) {
        const { encoded, elapsedTime } = hashCode(number);
        const md5encoded = md5(number);
        const sha1encoded = sha1(number);
        const sha256encoded = await sha256(number);
        const sha512encoded = await sha512(number);
        
        res.render("hashingInterface.ejs", { encoded: encoded, elapsedTime: elapsedTime, md5encoded: md5encoded, sha1encoded: sha1encoded,sha256encoded: sha256encoded, sha512encoded:sha512encoded });
    } else {
        res.render("hashingInterface.ejs", { encoded: null, elapsedTime: null, md5encoded: null, sha1encoded: null });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function hashCode(number) {
    const startTime = performance.now();
    var hashed = [];
    for (let n = 0; n < number.length; n++) {
        let charCode = number.charCodeAt(n);
        let digit = Number(charCode);
        if (!isNaN(digit)) {
            let power = (n === 0) ? 0 : (n - 1); 
            let hashedNumber = digit * (31 ** power);
            hashed.push(hashedNumber);
        }
    }
    const endTime = performance.now();
    var joinArray = hashed.join(""); 
    var encoded = BigInt(joinArray);
    const elapsedTime = endTime - startTime;

    return { encoded: encoded, elapsedTime: elapsedTime };
}

