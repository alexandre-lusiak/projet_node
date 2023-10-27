import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import {checkAgeform} from './utils/formValidator.js'
import 'moment/locale/fr.js'
import moment from "moment";
import {students} from './const/students.js';
dotenv.config()
const { PORT  }= process.env
moment.locale("fr")

const server = http.createServer(async (req, res) => {
  // Définir le type de contenu de la réponse
  res.setHeader('Content-Type', 'text/html'); 

  // Gérer la route "/"
  if (req.url === '/' || req.url === '/index.html') {
    // Lire le contenu du fichier HTML
    try {
      const data = await fs.readFileSync('view/home.html', { encoding: 'utf8'});
     
      res.writeHead(200);
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Erreur Julia est trop nulle');
    }
  } else if (req.url === '/assets/css/style.css') {
    // Lire le contenu du fichier CSS
    try {
      const data = await fs.readFileSync('assets/css/style.css', { encoding: 'utf8'});
      res.setHeader('Content-Type', 'text/css');
      res.writeHead(200);
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Erreur interne du serveur à cause d\'Alexandre qui veut rajouter Zizou');
    }
  } else if(req.url === '/students'){
        try{
        const data = await fs.readFileSync('view/students/students-list.html', { encoding: 'utf8'});
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
    } catch (err) {
        res.writeHead(500);
        res.end("Erreur interne de Tibo la chèvre");
    }
    } else if(req.url === '/student/create'){
        const resData = {}
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());
        if(checkAgeform(data).error){
        resData.error = checkAgeform(data).message
            } else {
            const formattedName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            data.name = formattedName
            const student = {
                name : data.name,
                birth : moment(data.birthdate, 'YYYY-MM-DD').format('YYYY-DD-MM')
            }
            students.push(student)
        }
        res.writeHead(200);
        res.end(JSON.stringify(resData));
        })
    } else if(req.url === '/students/list') {
        const returnStudents = [];
        students.forEach((student, index) => {
            const studentNew = {
                name : student.name,
                birth : moment(student.birth, 'YYYY-DD-MM').format('DD-MM-YYYY'),
            };
            returnStudents.push(studentNew)
        })
        res.writeHead(200)
        res.end(JSON.stringify({students : returnStudents}))

    } else if (req.url.startsWith('/students/delete/')) {
        const parts = req.url.split('/');
        const index = parseInt(parts[parts.length - 1]);
         
        if (!isNaN(index) && index >= 0 && index < students.length) {
            students.splice(index, 1); // Supprimez l'étudiant à l'index donné
            res.writeHead(200);
            res.end('Étudiant supprimé avec succès. Assassin!');
        } else {
            res.writeHead(400);
            res.end('Index d\'étudiant invalide. Mais auriculaire OK');
        }
    }
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});