const express  = require('express');
const exphbs   = require('express-handlebars');
const path     = require('path');
const mongodb  = require('mongodb');
const app      = express();
const mongoose = require('mongoose');
const Group = require('./models/group');
const browserSync = require('browser-sync');
const connectBrowserSync = require('connect-browser-sync');

const PORT = 4001;

app.use(connectBrowserSync(browserSync({ port: 3001 })));

app.listen(PORT, function() {
    console.log(`O express está rodando na porta ${PORT}`);
});

// handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    extname: '.hbs', 
    defaultLayout: 'layout', // layout base
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta onde fica o layout base
    partialsDir: path.join(__dirname, 'views/partials') // Diretório para componentes reutilizáveis
}));
app.set('view engine', '.hbs');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// rotes
app.use('/grupos', require('./routes/groups'));

app.get('/', (req,res) => {res.render('inicio', {title: 'Tips and Tips - Início'})});

app.get('/grupos', async (req, res) => { // Busca todos os grupos pra aba GRUPOS
    try {
        const grupos = await Group.find(); 
        res.render('grupos', { grupos });  
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao buscar grupos');
    }
});
app.get('/grupos/:id', async (req,res) => { // Busca cada grupo pra página individual de cada GRUPO
    try {
        const group = await Group.findById(req.params.id);
        res.render('grupo', { group });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao buscar o grupo');
    }
});

// MongoDb
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/banco-grupos')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro de conexão', err));

// Adicionar grupos via JSON

const fs = require('fs'); // Módulo de sistema de arquivos

// Função para adicionar grupos ao MongoDB a partir do JSON
const addGroupsFromJson = () => {
  // Ler o arquivo grupos.json
  fs.readFile('grupos.json', 'utf8', async (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    try {
      const groups = JSON.parse(data); // Converter o JSON em objeto
      // Inserir os grupos no MongoDB
      for (const group of groups) {
        const newGroup = new Group(group);
        await newGroup.save(); // Salvar cada grupo
      }
      console.log('Grupos adicionados com sucesso ao MongoDB!');
    } catch (err) {
      console.error('Erro ao processar os dados:', err);
    }
  });
};

// Duplicação
const groupData = { name: 'Grupo 1'};
Group.findOne({ name: groupData.name})
  .then(group => {
    if (!group) {
      return Group.create(groupData);
    } else {
      console.log('Grupo já existe, não será duplicado');
    }
  })
  .catch(err => console.error(err));

// Chamar a função quando o servidor for iniciado
addGroupsFromJson();
