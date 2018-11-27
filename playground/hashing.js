const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = '123abcdef';

// bcrypt.genSalt(11, function(err, salt) {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

var hash1 = '$2a$10$oJpxE3kWCZRZPGOjGYBwpO0x4C.N75qyzlowMT38AP.NCjxYci2iK';
var hash2 = '$2a$11$EbpJqbVBp7t9sbUOIJGxk.C/kDLjg3XJpCmQiksdgOH.RdocTJGTW';
bcrypt.compare(password, hash2).then((res) => console.log(res));

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');

// console.log(token);

// // jwt.verify()

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded :', decoded);


// var message = 'I am user number 33';
// var hash = SHA256(message).toString();

// console.log('Message:', message);
// console.log('Hash:', hash);

// var data = {
//     id: 33
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was changed. Don\'t trust');
// }