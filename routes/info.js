const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let costs = ['GET semua seni tanpa filter : 10 kuota', 'GET seni dengan filter : 5 kuota', 'GET seni dengan ID : 3 kuota', 'GET seni dengan nama seniman tanpa filter : 8 kuota', 'GET seni dengan nama seniman dengan filter : 3 kuota', 'GET seni dengan nama seniman dengan ID : 1 kuota']
    let message_0 = 'Untuk account yang baru daftar akan diberikan 10 kuota, kuota dapat digunakan untuk menggunakan service kami, berikut adalah list dari service kami dan harganya: '

    let welcome_message = {
        pengantar: message_0,
        services: costs
    }
    res.status(200).send(welcome_message)
})

module.exports = router