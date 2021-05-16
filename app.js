















function  emailForm(){

$(document).ready(function(){
    $('.submit').click(function(event){
        console.log("cliquei no botao")

        var name=document.getElementsByName("name").value
        var email=document.getElementByName("email").value
        var message=document.getElementByName("message").value


        if(email.length>5 && email.includes('@') && email.includes('.')){
            console.log("Email correto");
        }
        else{
            event.preventDefault()
            window.alert("E-mail invalido, cheque novamente")
            console.log(email.length)
        }



        if(name.length>2 ){
            console.log("Nome correto")
        }else{
            event.preventDefault()
            window.alert("Nome incorreto, deve ter mais que 2 caracteres");
          
        }


        if(message.length<1000){
            console.log("Mensagem válida")

        }else{
            event.preventDefault()
            window.alert("Mensagem muito longa")
           
        }

    })
})

}






const express= require("express");
const app = express();

const mysql = require("mysql");
const dotenv = require("dotenv")
const path = require("path");
var flash = require('req-flash');


var session = require('express-session');
var fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");



dotenv.config({path: './.env'})

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
const publicDirectory = path.join(__dirname, './public')
const publicUpload = path.join(__dirname, './uploadedImages')
app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
    }));

app.use(express.static(publicDirectory));
app.use(express.static(publicUpload));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(flash());
app.use(cookieParser());
app.use(fileUpload());





app.set('view engine', 'hbs');




db.connect(  (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("mysql connected")
    

    }
})



app.get('/uploadImages',(req,res) =>{
    
    var exercisesSegunda = []
    var exercisesTerca = []
    var exercisesQuarta = []
    var exercisesQuinta = []
    var exercisesSexta = []
    var exercisesSabado = []
    var exercisesDomingo = []
    var imagem=[]
    var userEmail = req.cookies['myEmail'];

    if(req.cookies['adminUser']!=null){
        userEmail=req.cookies['adminUser']
    }
    db.query("SELECT id FROM users2 WHERE email=?",[userEmail],async (error,results) =>{
        if(error){

        }else{
        idAluno = results[0].id
        db.query("SELECT * FROM planilhausers2 WHERE idAluno=?",[idAluno],async(error,results)=>{
        for(i=0;i<results.length;i++){
            if(results[i].diaDaSemana==1){exercisesSegunda.push(results[i].exercicio)}
            if(results[i].diaDaSemana==2){exercisesTerca.push(results[i].exercicio)}
            if(results[i].diaDaSemana==3){exercisesQuarta.push(results[i].exercicio)}
            if(results[i].diaDaSemana==4){exercisesQuinta.push(results[i].exercicio)}
            if(results[i].diaDaSemana==5){exercisesSexta.push(results[i].exercicio)}
            if(results[i].diaDaSemana==6){exercisesSabado.push(results[i].exercicio)}
            if(results[i].diaDaSemana==7){exercisesDomingo.push(results[i].exercicio)}
        }


        ///////////////// DELETAR ESSE QUERY DEPOIS Só pra printar
        /*
        db.query("SELECT * FROM planilhausers2 WHERE exercicio='SUPINO'",async(error,results)=>{
            if(error){console.log(error)}
            imagem.push(results[0].images)
          
            
        })
        */
        
        })
        
      
        
        res.render('uploadImages', {name:userEmail ,exercisesSegunda:exercisesSegunda,exercisesTerca:exercisesTerca,exercisesQuarta:exercisesQuarta,exercisesQuinta:exercisesQuinta,exercisesSexta:exercisesSexta,exercisesSabado:exercisesSabado,exercisesDomingo:exercisesDomingo})
    }

        
        
        
    })



 
})
app.post('/uploadImages',isAdmin,(req,res)=>{
    let sampleFile;
    let uploadPath;

    exercicioSelecionado =(req.body.selectedExercise)
    let weekDay = (req.body.weekDay)
    weekDay = weekDay.split(",")
    
    if(!req.files||Object.keys(req.files).length===0){
        return res.status(400).send("No files uploaded")
    }
        sampleFile = req.files.sampleFile;
       
        uploadPath = __dirname + '/uploadedImages/' + sampleFile.name;
        //use MV Function
        sampleFile.mv(uploadPath,function(err){
            if(err) return res.status(500).send(err)
        });
        for(j=0;j<weekDay.length;j++){
        db.query('UPDATE planilhausers2 SET images=? WHERE exercicio=?' ,[sampleFile.name,exercicioSelecionado],async(error,results)=>{
            if(error){console.log(error)}
            else{
                
            }
        })
        }
        res.redirect('uploadImages')
        
      
        
    
})





app.use('/', require('./routs/pages'))
app.use('/auth', require('./routs/auth'))

app.listen(3000,() =>{
    console.log("Server started")
})


function isAdmin(req,res,next){
    var email = req.cookies['myEmail']
    db.query('SELECT admin FROM users2 WHERE email = ?', [email],async (error,results) =>{
        if(error){
            console.log(error)
        }else{
            admin = results[0].admin
            console.log(admin)
            if(admin==1){
                return next()
            }else{
                res.redirect('login')
            }
        }
    })
}



