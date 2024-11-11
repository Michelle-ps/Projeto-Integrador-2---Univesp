import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;
const bodyParser = require('body-parser');
import express from "express"; // servidor
import mongoose from "mongoose"; // conecta ao mongo DB
import * as path from 'path';
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
const server = createServer((req, res) => {   // (1)
  return staticHandler(req, res, { public: 'public' })
});
const wss = new WebSocketServer({ server })

wss.on('connection', (client) => {
  console.log('Client connected !')
  const changeStream = Tarefa.watch();
  changeStream.on('change', async next => {
    // process next document
    try{
          const tarefa = await Tarefa.find({});
          console.log('tarefa change stream ws', tarefa);
    
          
          
  console.log('changeStream:', next);

  client.send(tarefa);
     
    }catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  
   
  
  
   
      
    })



  client.on('message', (msg) => {    // (3)
      console.log(`Message:${msg}`);
      broadcast(msg)
  })
})
function broadcast(msg) {       // (4)
  for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
          client.send(msg)
      }
  }
}
server.listen(process.argv[2] || 8080, () => {
  console.log(`server listening...`);
})

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(
    "mongodb+srv://pi2:projeto2024@cluster0.tk6t0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   ,  clientOptions
   )
.then(() => console.log("banco de dados conectado"))
.catch((e) => console.log("Erro" + e ))

const db = mongoose.connection;

const tarefaSchema = {
    text: {
      type: String,
      required: true
  
  },
  situacao: {
      type: String,
      
  
  },
  date: {
      type: Date,
      
  
  },
  }

  const Tarefa = mongoose.model("Tarefa", tarefaSchema);

  const changeStream = Tarefa.watch();
changeStream.on('change',  next => {
  // process next document
  console.log('changeStream:', next);


 
    
  })
  

  app.listen(5500, () => {
    console.log('listening on 5500');
  });

  app.get('/', (req, res) => { res.sendFile(path.join( __dirname +'/index.html')); });

  app.get('/tarefas.html', (req, res) => { res.sendFile(path.join( __dirname +'/tarefas.html')); });

   app.get('/tarefas.json', async (req, res) => {
    try{


 

      const tarefa = await Tarefa.find({});

  
        res.send(tarefa);     
     
    }catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  })

//app.post('/', async (req, res) => {
   // const click = {clickTime: "hoje"};
   // console.log(click);
    //console.log(client);

//});

app.post('/', async (req, res) => {
    // app.post('/index.html', async (req, res) => {
    console.log(db.toString());
    console.log('req.body.taskInput ' + req.body.taskInput);
    

   try {
    const newTarefa = new Tarefa({
      text: req.body.taskInput,
    situacao: "pendente",
    date: req.body.dateInput,
  });
    await newTarefa.save();
    res.send(newTarefa);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
  
   
  });


  app.post('/apagar' ,
    //urlencodedParser,
     async (req, res) => {
      // app.post('/index.html', async (req, res) => {
      console.log(db.toString());
      console.log('req.body.id ', req.body);
      
  
     try {
      const newTarefa = new Tarefa({
        _id: req.body.id,
     
    });
      await newTarefa.deleteOne(

      );
      console.log('cheguei aqui delete');
      res.send(newTarefa);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
    
     
    });


    app.post('/atualizar' ,
      
      //urlencodedParser,
       async (req, res) => {
        // app.post('/index.html', async (req, res) => {
        console.log(db.toString());
        console.log('req.body.atualizar ', req.body);

      
        
    
       try {
        
        await Tarefa.findOneAndUpdate(
          {
            _id: req.body.id,
         
        },
        {
          $set: { 
            text: req.body.taskInput,
            situacao: req.body.situacao,
            date: req.body.dateInput, 
          }
        },
        {
          new: true,
        }
        ).then(
          (obj) => {
            console.log('obj',obj)
          }
        );
        console.log('cheguei aqui atualizar');

        res.send(200);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
      
       
      });


      app.post('/situacao' ,
      
        //urlencodedParser,
         async (req, res) => {
          // app.post('/index.html', async (req, res) => {
          console.log(db.toString());
          console.log('req.body.atualizar ', req.body);
  
        
          
      
         try {
          
          await Tarefa.findOneAndUpdate(
            {
              _id: req.body.id,
           
          },
          {
            $set: { 
              text: req.body.taskInput,
              situacao: req.body.situacao,
              date: req.body.dateInput, 
            }
          },
          {
            new: true,
          }
          ).then(
            (obj) => {
              console.log('obj',obj)
            }
          );
          console.log('cheguei aqui atualizar');
  
          res.send(200);
        } catch (error) {
          console.error(error);
          res.status(500).send(error);
        }
        
         
        });







//app.get('localhost:5500/tarefas.html', (req, res) => 
   // res.send('<h1 style="color: blue">CRIANDO UM SERVIDOR COM EXPRESS.JS</h1>')
   // );