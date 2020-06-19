var express = require('express');
var app =express();
var ejs =require('ejs')
var request =require('request')
var bodyParser=require('body-parser')
const port =3000||process.env.port ;
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


function getYesDate(){
    var today = new Date();
var dd = today.getDate()-1;
var mm = today.getMonth(); 
var yyyy = today.getFullYear();
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
if(dd<10) 
{
    dd='0'+dd;
} 
today = dd+'-'+month[mm]+'-'+yyyy.toString().substr(-2);;
return today;
}

app.get('/',(req,res)=>{
    request('https://api.covid19india.org/states_daily.json',{json:true},(err,result,body)=>{
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            var confrimed=0 ,recovered =0 ,deceased=0 ;
            data = body['states_daily'];
            for(var i=0;i<data.length;i++ ){
                if(data[i]['status']=='Confirmed')
                  {
                    confrimed=confrimed+Number(data[i]['tt']);
                  }
                 else if(data[i]['status']=="Recovered")
                  {
                    recovered=recovered+Number(data[i]['tt']);
                  }
                 else if(data[i]['status']=="Deceased")
                  {
                    deceased=deceased+Number(data[i]['tt']);
                  }
            }
           
            summary = {
                "total": confrimed,
                "discharged": recovered,
                "deaths": deceased,
             }
            res.render('covid19',{summary:summary});
        }
    })
    
})

app.get('/stateview/:id',(req,res)=>{

today=getYesDate();
    request('https://api.covid19india.org/states_daily.json',{json:true},(err,result,body)=>{
        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            var stateWiseConfrimed=0 ,stateWiseRecovered =0 ,stateWiseDeceased=0 ;
            data = body['states_daily'];
            
            for(var i=0;i<data.length;i++ ){

                if(data[i]['status']=='Confirmed')
                  {
                    stateWiseConfrimed=stateWiseConfrimed+Number(data[i][req.params.id]);
                  }
                 else if(data[i]['status']=="Recovered")
                  {
                    stateWiseRecovered=stateWiseRecovered+Number(data[i][req.params.id]);
                  }
                 else if(data[i]['status']=="Deceased")
                  {
                    stateWiseDeceased=stateWiseDeceased+Number(data[i][req.params.id]);
                  }
                  
                }
            
            summary = {
                "total":stateWiseConfrimed,
                "discharged": stateWiseRecovered,
                "deaths": stateWiseDeceased,
             }
             totalToday = data[data.length-3];
             recoveredToday = data[data.length-2];
             deceasedToday = data[data.length-1];

             summaryToday={
                "total":totalToday[req.params.id],
                "discharged": recoveredToday[req.params.id],
                "deaths": deceasedToday[req.params.id],  
             }
             res.render('stateview',{data:{summary:summary,summaryToday:summaryToday }})
        }
    })
    
})
app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("successfully connected to "+port)
    }
})

