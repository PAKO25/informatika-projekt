const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'lepogeslo';


bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    // Store hash in your password DB.

    console.log(hash)

    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        // result == true
        console.log(result)
    });
});