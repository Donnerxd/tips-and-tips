const { google } = require('googleapis'); // Biblioteca para acessar as APIs do Google
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Importa o modelo do MongoDB (substitua pelo caminho correto do seu modelo)
const Group = require('../models/group'); // Ajuste o caminho se necessário

// Criação do JWT client para autenticação com a Google Sheets API
const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

// Inicializar a Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Função para buscar o ID da planilha no MongoDB
async function getSpreadsheetIdFromDB(groupName) {
    const group = await Group.findOne({ name: groupName });
  
    if (!group) {
      console.error(`Grupo ${groupName} não encontrado.`);
      return null;
    }
  
    // Se o campo planilha contém a URL completa, vamos extrair apenas o ID da planilha
    const spreadsheetUrl = group.planilha;
    const spreadsheetId = spreadsheetUrl.split('/d/')[1]?.split('/')[0]; // Pega o ID da URL
  
    console.log(`Grupo encontrado: ${group.name}`);
    console.log(`ID da Planilha para ${groupName}: ${spreadsheetId}`);
  
    return spreadsheetId || null;
}
  

// Função para ler dados da planilha
async function getCellData(groupName) {
    const spreadsheetId = await getSpreadsheetIdFromDB(groupName); // ID da planilha

    if (!spreadsheetId) {
        console.error(`Spreadsheet ID não encontrado para o grupo: ${groupName}`);
        return {};
    }

    const ranges = ['resumo!C27', 'resumo!D27', 'resumo!F27'];

    try {
        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        });
        
        const values = response.data.valueRanges.map((range) => range.values ? range.values[0][0] : null);
        
        return {
            totalApostas: values[0],
            totalInvestido: values[1],
            lucroDado: values[2],
        };
    } catch (error) {
        console.error('Erro ao acessar a planilha:', error);
        return {};
    }
}

// Função para pegar todos os grupos do banco e processar os dados
async function fetchAllGroupData() {
  try {
    const groups = await Group.find({}); // Pega todos os grupos do banco
    if (groups.length === 0) {
      console.log("Nenhum grupo encontrado no banco.");
      return;
    }
    console.log(`Encontrados ${groups.length} grupos.`); // Verifique quantos grupos foram encontrados
    for (const group of groups) {
      const groupName = group.name; // Pega o nome de cada grupo
      console.log(`Buscando dados para o grupo: ${groupName}`); // Confirma que está tentando buscar para o grupo certo
      await getCellData(groupName); // Chama a função getCellData para cada grupo
    }
  } catch (error) {
    console.error('Erro ao buscar dados dos grupos:', error);
  }
}

// Chama a função que vai buscar e processar todos os grupos
fetchAllGroupData();

module.exports = { getCellData };





