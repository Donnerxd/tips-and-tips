const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const { readSheet } = require('../services/googleSheets');


// Rota para a lista de grupos
router.get('/', async (req, res) => {
  try{
    const groups = await Group.find().lean();
    console.log('Grupos:', groups);

    // Para cada grupo, busque os dados da planilha usando o link da planilha
    const excelData = [];
    for (let group of groups) {
      if (group.planilha) {
        // Extraí o ID da planilha do link (parte após "/d/")
        const sheetId = group.planilha.split('/d/')[1].split('/')[0];
        const sheetData = await readSheet(sheetId, 'A1:B10'); // Exemplo de intervalo da planilha
        
        // Adiciona os dados da planilha ao grupo
        excelData.push({
          name: group.name,
          performance: sheetData, // Os dados da planilha
        });
      }
    }

    res.render('grupos', { title: 'Tips and Tips - Grupos', groups, excelData });
  } catch (err) {
    console.error('Erro ao buscar grupos:', err);
    res.status(500).send('Erro ao buscar grupos');
  }
});




module.exports = router;