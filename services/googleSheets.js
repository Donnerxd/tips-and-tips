const { google } = require('googleapis'); // Biblioteca para acessar as APIs do Google
const path = require('path');
const fs = require('fs');

// Carregar o arquivo de credenciais JSON (arquivo baixado do Google Cloud)
const credentials = require('../config/key.json');

// Criação do JWT client para autenticação com a Google Sheets API
const auth = new google.auth.JWT(
  credentials.client_email, null, credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets.readonly'], null
);

// Inicializar a Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Função para ler dados da planilha
async function getCellData() {
    const spreadsheetId = '1g73sROsER59LhMMsgKJADroM5gclTYBkPa8tWoUBX9k'; // ID da sua planilha
    const range = 'resumo!D3'; // Aba 'resumo', célula D3
  
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      
      const totalApostas = response.data.values ? response.data.values[0][0] : null;
      console.log('Total de apostas:', totalApostas);
    } catch (error) {
      console.error('Erro ao acessar a planilha:', error);
    }
}
  
getCellData();

module.exports = { getCellData };
