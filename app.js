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

app.use(express.json());

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
        res.render('grupos', { groups: grupos });  
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

app.post('/adicionar-grupos', async (req, res) => {
  try {
    const { name, about, twitter, telegram, casas, tipo, products, planilha, images } = req.body;

    // Verifica se os campos necessários foram fornecidos
    if (!name || !about || !twitter || !telegram || !casas || !tipo || !products || !planilha) {
      return res.status(400).send('Todos os campos são obrigatórios!');
    }

    // Cria um novo grupo usando o modelo Group
    const novoGrupo = new Group({
      name,
      about,
      twitter,
      telegram,
      casas,
      tipo,
      products,
      planilha,
      images: images || [] // Se imagens não forem enviadas, atribui um array vazio
    });

    // Salva o novo grupo no banco de dados
    await novoGrupo.save();
    res.status(201).send('Grupo adicionado com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar grupo:', err);
    res.status(500).send('Erro ao adicionar o grupo');
  }
});

// MongoDb
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/banco-grupos')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro de conexão', err));

// Adicionar grupos via JSON



