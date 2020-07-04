const express = require('express');
const Todo = require('../models/todoSchema');

const todoRouter = express.Router();

todoRouter.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.status(200).render('todo/todo.hbs')
})

todoRouter.get('/add',(req,res)=>{
    res.status(200).render('todo/addTodo.hbs',{
        title:'Add Your TODO',
        todo:req.body
    });
})
todoRouter.post('/',(req,res)=>{

    if(req.body._id == '')
    {
        insertTodo(req,res)
    }
    else{
     
        updateTodo(req,res)
    }
   
})


function insertTodo(req,res){
    var todo = new Todo();
  
    todo.desc = req.body.desc;
  
    if(todo.desc ==undefined)
    {
        res.status(200).render('todo/addTodo.hbs',{
            title:'Add Your TODO',
            error:'Enter all the fields',
            todo:req.body
        });
        console.log(req.body)
        return;
    }  

todo.save((err)=>{
    if(!err)
    {
        res.redirect('/add/info');
        console.log(req.body)
    }
    else
    {
        res.status(200).render('todo/addTodo.hbs',{
            title:'Add Your TODO',
            todo:req.body

        })
        console.log("Some error occured on saving the todo"+err);
    }
});
}


// +++++++++++++++++++++++ROUTS FOR DISPLAYING THE TODO INFO++++++++++++++++++++++
todoRouter.get('/info',(req,res)=>{
   //using find method from mongo-express
   Todo.find((err,docs)=>{
       if(!err)
       {
           res.status(200).render('todo/info.hbs',{
               title:'Your TODOs',
               info:docs
           });

       }
       else
       {
           console.log("Some eroe occured in showing the todos "+err);
       }
   })


})
// ================================ROUTES FOR UPDATING THE TODOs=======================
todoRouter.get('/:id',(req,res)=>{
    Todo.findById(req.params.id,(err,docs)=>{
        res.status(200).render('todo/addTodo.hbs',{
            title:"Update TODO",
            todo:docs 
        })
    })

})



//++++++++++FUNCTION FOR UPDATING THE TODO+++++++++++++++++++++

function updateTodo(req,res){
    Todo.findOneAndUpdate({_id:req.body._id}, req.body ,{new:true},(err)=>{
        if(!err)
        {
            res.status(200).redirect('/add/info')
        }
        else{
               res.status(200).render('todo/addTodo.hbs',{
                    title:'Updatex   TODO',
                    todo:req.body
                });
            
            console.log("Some error occured on updating the TODO"+err);
        }
    });
}


// ==========================ROUTES FOR DELETING THE TODOs=======================
todoRouter.get('/delete/:id',(req,res)=>{
    Todo.findByIdAndRemove(req.params.id,(err)=>{
        if(!err)
        {

            res.status(200).redirect('/add/info');
        }
        else{
            console.log('Some eeror on deleting the todo'+err);
        }
    })
})









module.exports=todoRouter;
