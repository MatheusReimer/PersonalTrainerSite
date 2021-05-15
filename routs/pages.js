const express= require("express");

const { route } = require("./auth");
const router = express.Router();
const path = require("path");
const mysql = require("mysql");
const publicUpload = path.join(__dirname, './uploadedImages')
router.use(express.static(publicUpload));
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});



router.get('/',(req,res) =>{
    res.render('index')
})
router.get('/services',(req,res) =>{
    res.render('services')
})

router.get('/login',loggedUser,(req,res) =>{
    
    res.render('login')
   
})
router.get('/contacts',(req,res) =>{
    res.render('contacts')
})

router.get('/register',authFunct,isAdmin,(req,res) =>{
    res.render('register')
})




router.get('/userPage',authFunct,async (req,res) =>{
    const delay = ms => new Promise(res => setTimeout(res, ms));
    var arrayOfCookies = req.cookies['myEmail'];
    console.log("Array of cookies = "+ arrayOfCookies)
    var loggedUserId
 
    var allExercises = []
    
    var exercisesSegunda = []

    var exercisesTerca = []
    var exercisesQuarta = []
    var exercisesQuinta = []
    var exercisesSexta = []
    var exercisesSabado = []
    var exercisesDomingo = []
    var imagesSegunda = []
    var imagesTerca = []
    var imagesQuarta = []
    var imagesQuinta = []
    var imagesSexta = []
    var imagesSabado = []
    var imagesDomingo =[]
    var seriesSegunda = []
    var seriesTerca = []
    var seriesQuarta = []
    var seriesQuinta = []
    var seriesSexta = []
    var seriesSabado = []
    var seriesDomingo =[]
    contador= 1;

    admin=0
    let nameToDisplay;
    await db.query('SELECT name FROM users2 WHERE email = ?', [arrayOfCookies],async (error,results) =>{
    nameToDisplay = results[0].name
    
    })
    
    await db.query('SELECT admin FROM users2 WHERE email = ?', [arrayOfCookies],async (error,results) =>{
        admin = results[0].admin
        console.log(admin)

    })


    if(req.cookies['adminUser']!=null){
        arrayOfCookies=req.cookies['adminUser']
    }    

     
    ///MAIN QUERY
    await db.query('SELECT id FROM users2 WHERE email = ?', [arrayOfCookies],async (error,results) =>{
        
        (loggedUserId = results[0].id);
     
        for(q=1;q<=7;q++){
        await db.query('SELECT * FROM planilhausers2 WHERE idAluno = ? AND diaDaSemana = ?',[loggedUserId, q],async(error,results)  =>{
             (getResults = results[0])
           
            if(getResults==null ){
              
              
                    contador++;
                
            }else{
             
       
               for(r=0;r<results.length;r++){
                   if(contador==1 ){
                       exercisesSegunda.push(results[r].exercicio);
                       imagesSegunda.push(results[r].images)
                       seriesSegunda.push(results[r].series)

                    
                    }
                   if(contador==2 ){exercisesTerca.push(results[r].exercicio);
                   imagesTerca.push(results[r].images)
                   seriesTerca.push(results[r].series)
                   
                }
                   if(contador==3){exercisesQuarta.push(results[r].exercicio);imagesQuarta.push(results[r].images);  seriesQuarta.push(results[r].series)}
                   if(contador==4){exercisesQuinta.push(results[r].exercicio);imagesQuinta.push(results[r].images);  seriesQuinta.push(results[r].series)}
                   if(contador==5){exercisesSexta.push(results[r].exercicio);imagesSexta.push(results[r].images);  seriesSexta.push(results[r].series)}
                   if(contador==6){exercisesSabado.push(results[r].exercicio);imagesSabado.push(results[r].images);  seriesSabado.push(results[r].series)}
                   if(contador==7){exercisesDomingo.push(results[r].exercicio);imagesDomingo.push(results[r].images);  seriesDomingo.push(results[r].series)}
         
                  
               }
             
              
               
         
               contador++
              
               
            }
        
            
        })
      
      
    }
      
    req.exercisesSegunda= exercisesSegunda
    req.exercisesTerca = exercisesTerca
    req.exercisesQuarta = exercisesQuarta
    req.exercisesQuinta = exercisesQuinta
    req.exercisesSexta = exercisesSexta
    req.exercisesSabado = exercisesSabado
    req.exercisesDomingo = exercisesDomingo
    req.imagesSegunda = imagesSegunda
    req.imagesTerca = imagesTerca
    req.imagesQuarta = imagesQuarta
    req.imagesQuinta = imagesQuinta
    req.imagesSexta = imagesSexta
    req.imagesSabado = imagesSabado
    req.imagesDomingo = imagesDomingo
    req.seriesSegunda = seriesSegunda
    req.seriesTerca = seriesTerca
    req.seriesQuarta = seriesQuarta
    req.seriesQuinta = seriesQuinta
    req.seriesSexta = seriesSexta
    req.seriesSabado = seriesSabado
    req.seriesDomingo = seriesDomingo
    
    
    let resultadosTotaisPesoEmOrdem =[];
    let resultadosTotaisRepeticoesEmOrdem =[];
    let resultadosTotaisSeriesEmOrdem =[];
    let resultadosTotaisDiasEmOrdem =[];
    let resultadosExerciciosEmOrdem =[]
    let volumes = []
    var arrayOfCookies = req.cookies['myEmail'];
    var biarray

    await db.query('SELECT * FROM planilhausers2 WHERE idAluno= ? ORDER BY dateOfExercise DESC',[loggedUserId],async(error,results) =>{
        if(error){console.log(error)}
        else{
            for(i=0;i<results.length;i++){
            resultadosTotaisPesoEmOrdem.push( results[i].peso);
            resultadosTotaisRepeticoesEmOrdem.push( results[i].repeticoes);
            resultadosTotaisSeriesEmOrdem.push( results[i].series);
            resultadosTotaisDiasEmOrdem.push( results[i].diaDaSemana);
            resultadosExerciciosEmOrdem.push(results[i].exercicio)
            }
            
          
        }
         
        for(var i = 0; i < resultadosTotaisDiasEmOrdem.length; i++){
            var value = resultadosTotaisPesoEmOrdem[i] * resultadosTotaisRepeticoesEmOrdem[i] * resultadosTotaisSeriesEmOrdem[i];
            volumes[i] = value;
        }
       
       
    })
    
 
   
 
    await delay(3000);
    return res.render('userPage',  {nameOfUser:nameToDisplay,name: arrayOfCookies,volumes:volumes,resultadosExerciciosEmOrdem:resultadosExerciciosEmOrdem,resultadosTotaisSeries:resultadosTotaisSeriesEmOrdem, admin:admin,seriesSegunda:req.seriesSegunda,seriesTerca:req.seriesTerca,seriesQuarta:req.seriesQuarta,seriesQuinta:req.seriesQuinta,seriesSexta:req.seriesSexta,seriesSabado:req.seriesSabado,seriesDomingo:req.seriesDomingo,imagesSegunda:req.imagesSegunda,imagesTerca:req.imagesTerca,imagesQuarta:req.imagesQuarta,imagesQuinta:req.imagesQuinta,imagesSexta:req.imagesSexta,imagesSabado:req.imagesSabado,imagesDomingo:req.imagesDomingo, exercisesSegunda:req.exercisesSegunda, exercisesTerca:req.exercisesTerca, exercisesQuarta:req.exercisesQuarta, exercisesQuinta:req.exercisesQuinta, exercisesSexta:req.exercisesSexta, exercisesSabado:req.exercisesSabado,exercisesDomingo:req.exercisesDomingo })
    })
   


})



router.get('/personal',authFunct,isAdmin,(req,res) =>{
    var cookieAdmin = req.cookies['adminUser'];
    //const nameUser = require('../controllers/auth')
    //res.render('userPage',  {name: nameUser })
    var arrayOfCookies = req.cookies['myEmail'];


    
    //console.log(arrayOfCookies)
    return res.render('personal',  {name: arrayOfCookies, cookieAdmin:cookieAdmin})
    



})

router.get('/userStats',authFunct,async(req,res) =>{
    const delay = ms => new Promise(res => setTimeout(res, ms));
    var userEmail = req.cookies['myEmail'];
    var arrayOfExercises=[]
    var arrayOfMember=[]
    var arrayOfPeso = []
    var arrayOfDiasDaSemana = []
    var arrayOfSeries =[]
    var arrayOfRep = []
    var arrayOfDays =[]
    var contador = 0;

    await db.query('SELECT admin FROM users2 WHERE email = ?', [userEmail],async (error,results) =>{
        admin = results[0].admin
        console.log(admin)

    })    

     
    
   
    if(req.cookies['adminUser']!=null){
        userEmail=req.cookies['adminUser']
    }
       
        console.log("Email: " + userEmail)
        await db.query('SELECT id FROM users2 WHERE email = ?', [userEmail],async (error,results) =>{
            userID = results[0].id;
           // console.log(userID)
           if(userID==null){
             return res.render('userPage',{
                 message:"Usuário inexistente"
             })
            }else{
                
                await db.query('SELECT * FROM planilhausers2 WHERE idAluno = ? ORDER BY dateOfExercise ASC', [userID],async (error,results) =>{
                    fromStudent = results;
                    for(i=0;i<fromStudent.length;i++){
                        arrayOfPeso.push(fromStudent[i].peso)
                        arrayOfExercises.push(fromStudent[i].exercicio)
                        arrayOfMember.push(fromStudent[i].membro)
                        arrayOfDiasDaSemana.push(fromStudent[i].diaDaSemana)
                        arrayOfSeries.push(fromStudent[i].series)
                        arrayOfRep.push(fromStudent[i].repeticoes)
                        arrayOfDays.push(fromStudent[i].dateOfExercise)
                    }
                   
                   
                })
            }
        })
      
    

    
    //console.log(arrayOfCookies)
    await delay(2000)
    res.render('userStats',  {name: userEmail, admin:admin,peso:arrayOfPeso,exercise:arrayOfExercises,member:arrayOfMember,diasDaSemana:arrayOfDiasDaSemana,series:arrayOfSeries,rep:arrayOfRep,days:arrayOfDays})




})


router.get('/adminCheck',authFunct,isAdmin,async(req,res) =>{
    const delay = ms => new Promise(res => setTimeout(res, ms));
    idAlunos=[]
    arrayAlunosSemDuplicatas=[]
    var arrayOfEmails =[]
    
    db.query('SELECT id from users2',async (error,results) =>{
        for(i=0;i<results.length;i++){
            idAlunos.push(results[i].id)
        }

        arrayAlunosSemDuplicatas = idAlunos.filter (function (value, index, array) { 
            return array.indexOf (value) == index;
        });
        
 

        ///SELECIONAR OS NOMES REFERENTES AOS ID'S
        x=[]
       
        
        for(z=0;z<arrayAlunosSemDuplicatas.length;z++){
            db.query('SELECT email from users2 WHERE id=?',[arrayAlunosSemDuplicatas[z]],async (error,results) =>{
            x = results[0].email
            
            arrayOfEmails.push(x)
            
            
            
            })
       
        }

        
      
     

       
       
    })
    
    await delay(3000)
    res.render('adminCheck',{emails:arrayOfEmails})

})






function authFunct(req,res,next){
    if(req.cookies['myEmail']!=null){
        return next()
    }
    res.redirect('login')

}
function loggedUser(req,res,next){
    if(req.cookies['myEmail']!=null){
        res.redirect('userPage')
    }
            return next()

}
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
                res.redirect('userPage')
            }
        }
    })
}












module.exports = router;
