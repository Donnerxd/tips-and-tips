const express = require('express');
const router = express.Router();
const Group = require('../models/group');


// Rota para a lista de grupos
router.get('/', async (req, res) => {
  try{
    const groups = await Group.find();
    console.log(groups);
    res.render('grupos', { title: 'Tips and Tips - Grupos', groups });
  } catch(err) {
    res.status(500).send('Erro ao buscar grupos');
  }
});


module.exports = router;