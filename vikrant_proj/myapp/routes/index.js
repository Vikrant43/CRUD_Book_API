var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');

// I have removed remote mongodb password and username since it will show warning if I upload them on github
mongoose.connect('mongodb+srv://<admin>:<password>@avatar-cluster.t1hoc.mongodb.net/vikrantDB?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
  console.log("Conencted") 
}).catch(err=>console.log(err));

var Schema=mongoose.Schema;
var schema = new Schema({
name:{type:String},
img:{type:String},
summary:{type:String}
});

var Book=mongoose.model('Book',schema);



/*---------------------------------------saving hardcoded data route run only once---------------------------------------*/


// router.get('/', function(req, res) {
//   var hardcoded_data=[{name: "Harry Potter and the Order of the Phoenix",img: "https://bit.ly/2IcnSwz",summary: "Harry Potter and Dumbledore's warning aboutthe return ofLord Voldemort is not heeded by the wizard authoritieswho, in turn, look toundermine Dumbledore's authority at Hogwarts and discreditHarry."}, {name: "The Lord of the Rings: The Fellowship of theRing",img: "https://bit.ly/2tC1Lcg",summary: "A young hobbit, Frodo, who has found theOne Ring thatbelongs to the Dark Lord Sauron, begins his journeywith eight companions toMount Doom, the only place where it can be destroyed."}, {name: "Avengers: Endgame",img: "https://bit.ly/2Pzczlb",summary: "Adrift in space with no food or water,Tony Stark sends amessage to Pepper Potts as his oxygen supply startsto dwindle. Meanwhile, theremaining Avengers -- Thor, Black Widow, Captain America,and Bruce Banner --must figure out a way to bring back their vanquishedallies for an epic showdownwith Thanos -- the evil demigod who decimated theplanet and the universe."}]
// for(let i=0;i<hardcoded_data.length;i++)
// {
//   new Book(hardcoded_data[i]).save().then(()=>{console.log(`${i} data saved`)})
// }
//   res.render('index', { title: 'Express' });
// });


// api for reading the data from db----------------------
router.get('/api/fetch/books/:number',(req,res)=>{
let number=req.params.number
Book.find({}).limit(number).then(books=>{
  if(books[0])
  {
    return  res.json({success:1,books})
  }
  else
  {
    return res.json({success:0,message:"No books found"})
  }
})
})

// api for deleting book--------------------------------

router.get('/api/delete/book/:id',(req,res)=>{
  let id=req.params.id

  Book.findOne({_id:id}).then(book=>{
    if(book)
    {
      book.remove()
      return res.json({success:1,message:"Book deleted successfully"})
    }
    else
    {
      return res.json({succss:0,message:"No Book found wiht this id"})
    }
  })
})


//api for updating book ------------------------------


router.post('/api/update/book/:id',(req,res)=>{
  let id= req.params.id
  let {name , img , summary} = req.body

  Book.findOne({_id:id}).then(book=>{
    if(book)
    {
      if(name)
      book.name = name
      if(img)
      book.img=img
      if(summary)
      book.summary=summary

      book.save().then(()=>{
        return res.json({success:1,message:"Book updated successfully"})
      }).catch(err=>{
        return res.json({success:0,message:"Book updation failed"})
      })
    }
    else
    {
      return res.json({success:0,message:"No book found wit this id"}) 
    }
  })
})

// api for creating a book ----------------------

router.post('/api/create/book',(req,res)=>{
  let {name , img , summary} = req.body

  // pass name, img and summary inside body ---------------------------------
  if(!name || !img || !summary)
  {
    return res.json({success:0,message:"Fill all the fields"})
  }
  new Book(req.body).save().then(done=>{
   return res.json({success:1,message:"Book created successfully"})
  }).catch(err=>{
    return res.json({success:0,message:"Some error occured in creating new record"})
  })
})

module.exports = router;
