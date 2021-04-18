const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mysql = require("mysql")
const express= require("express")
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



exports.login = async (req, res) => {
    try {
        const{email, password} = req.body;

       
      

        if(!email || !password){
            res.clearCookie('myEmail');
            return res.status(400).render('login',{
                message:"A senha ou o e-mail precisa ser preenchido"
                
            })
            
        }
        db.query('SELECT * FROM users2 WHERE email = ?' , [email], async(error,results) =>{
            console.log(results);
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                res.clearCookie('myEmail');
                res.status(401).render('login', {
                    message:'Email or password is incorrect'
                    
                    
                })
            }else{
                const id= results[0].id;
                const token = jwt.sign({id: id}, process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN
                    
                });
                console.log("the token is"+token)
                const cookieOptions ={
                    expires: new Date(
                        Date.now()+process.env.JWT_EXPIRES *24*60*60*1000

                    ),
                    httpOnly:true
                }
                res.cookie('jwt',token,cookieOptions);
                
                res.status(200).redirect("/userPage")

            }
        })
    } catch (error) {
        console.log(error)
    }

  

  

}


exports.register = (req, res) => {
    console.log(req.body.email);

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  var isAdmin = req.body.admin

  console.log(isAdmin)

  db.query('SELECT email FROM users2 WHERE email = ?', [email],async (error,results) =>{
      if(error){
          console.log(error)
      }
      if(results.length > 0){
          return res.render('register', {
              message:'Email already in use'
          })
      }else if(password !== confirmPassword ){
        return res.render('register', {
            message:'Password do not match'
        })
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      if(isAdmin=="on"){
          isAdmin = 1;
      }else{isAdmin=0}


      db.query('INSERT INTO users2 SET ?', {name:name, email:email, password:hashedPassword,admin:isAdmin}, (error,results) =>{
        if(error){
            console.log(error)
        }else{
            res.render('register',{
                message:"user registered"
            })
        }
      })
      
    })
}





exports.personal = async(req, res) => {
    
  const checkbox = req.body.deleteExistingSpreadsheets
  const emailPlan = req.body.userEmailTrain;
  
  
  var totalRows = req.body.resultsArray;
  totalRows = totalRows.split(',')
  const weekDay = req.body.weekDay;
  var userExercise =[]
  var userMember=[]
  var userRep=[]
  var userSeries=[]
  var jaExistePlanilha 

    

    await db.query('SELECT id FROM users2 WHERE email = ?', [emailPlan],async (error,results) =>{
        resultadosGerais = results[0];
       if(resultadosGerais==null){
         return res.render('userPage',{
             message:"Usuário inexistente"
         })
         console.log(error)
     }else{

       
     const userId = results[0].id;

     if(checkbox=="on"){
        await db.query('DELETE FROM planilhausers2 WHERE idAluno=? AND diaDaSemana=?',[userId,weekDay],async(error,results)=>{
            if(error){console.log(error)}
        })

    }

    ///Inserindo os valores dentro dos arrays
     for(i =0; i<totalRows.length;i++){
         
        
        
        if(i%4==3){userSeries.push(totalRows[i]);}
        if(i%4==2){userRep.push(totalRows[i]); }
        if(i%4==1){userMember.push(totalRows[i]); }
        if(i%4==0){userExercise.push(totalRows[i]); }
       
        }

        await db.query('SELECT diaDaSemana FROM planilhausers2 WHERE idAluno = ?', [userId],async (error,results) =>{   
        let resultados = results; 
        
        for(z=0;z<results.length;z++){
            
            if(results[z].diaDaSemana==weekDay){
               jaExistePlanilha = true
            }
        }  
        })
       
                             ///Adicionando ao BD por linhas
     for (j=0;j<(totalRows.length/4);j++){

        try{
     
        await db.query('INSERT INTO planilhausers2 SET ?', {exercicio:userExercise[j].toUpperCase(), membro:userMember[j].toUpperCase(), repeticoes:userRep[j],idAluno:userId,diaDaSemana:weekDay,series:userSeries[j]}, (error,results) =>{
            if(error){
                console.log(error)
            }
            else if(jaExistePlanilha==true){
                
                    return res.render('personal',{
                        message:"Já existia uma planilha neste dia para este usuário, os exercicios colocados agora foram inseridos naquela planilha. Caso necessário, marque o checkbox para excluir"
                    })
                
            }
            else{
               
            }
          })
        }catch{
            console.log(error)
        }
        }
        return res.render('personal',{
            message:"Success creating spreadsheet"
        })

        
                
            }
        }
    
        
   
       
      

    )}

  

exports.userPage = (req, res) => {
    arrayOfExercices = []
    var diaSelecionado = req.body.diaSelecionado
    
    valor = req.body.peso
    
    console.log(req.cookies["adminUser"])
    if(typeof valor == "string"){valor=valor.split()}
    var exercicios = req.body.weekDay;
   
    var userEmail = req.body.email

    if(req.cookies['adminUser']!=null){
        userEmail=req.cookies['adminUser']
    } 

    var dateOfExercises = req.body.dateOfTrain
    
    arrayOfExercices = exercicios.split(",")
    arrayOfExercices = arrayOfExercices.filter(function(elem, pos) {
        return arrayOfExercices.indexOf(elem) == pos;
    })
    console.log("tamanho do array de exercicios" + arrayOfExercices.length)
    console.log("exercicios: "  +arrayOfExercices)
    contador =0

    
 
     db.query('SELECT id FROM users2 WHERE email = ?', [userEmail],async (error,results) =>{
         
         resultadosGerais = results[0];
        if(resultadosGerais==null){
          res.render('userPage',{
              message:"Usuário inexistente"
          })
          console.log(error)
      }else{
      const userId = results[0].id;
      contador2=0;
           
          
             for(count=0;count<arrayOfExercices.length;count++){

                 //SELECT NO  PESO
            db.query('SELECT * FROM planilhausers2 WHERE diaDaSemana =? AND idAluno=? AND exercicio=?',[diaSelecionado,userId,arrayOfExercices[contador]], (error,results) =>{
                
                allVariables = results[0]
                pesoCheck = results[0].peso
                
                ///CASO NAO TENHA NENHUM ELEMENTO NO BANCO DE DADOS
                
                if(pesoCheck==0){
                    console.log("valor contador = "+ valor[contador2])
                    db.query('UPDATE planilhausers2 SET peso =?,dateOfExercise=? WHERE idAluno =? AND diaDaSemana=? AND exercicio=?'  , [valor[contador2],dateOfExercises,userId,diaSelecionado,arrayOfExercices[contador2]], (error,results) =>{
                 
                        if(error){
                          console.log(error)
                        }else{
                         
                           
                        }
                    })
                    contador2++
                }
                ///CASO JA TENHA UM ELEMENTO NO BANCO DE DADOS
                else{
                   db.query('INSERT INTO planilhausers2 SET ?', {exercicio:allVariables.exercicio, idAluno:userId,membro:allVariables.membro,peso:valor[contador2],repeticoes:allVariables.repeticoes,series:allVariables.series,dateofExercise:dateOfExercises, diaDaSemana:allVariables.diaDaSemana}, (error,results) =>{
                    if(error){console.log(error)}

                   }
                    
                )
                contador2++;
                }
               
            })
            
             
             contador++;
             
             
         }
         
        }
     
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(2000)
        res.status(200).redirect("/userPage")
     
     })
     
    

    }






    
