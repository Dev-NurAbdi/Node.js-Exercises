const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: 1, title: 'The Power of Now', author: 'Eckhart Tolle' },
  { id: 2, title: 'Mindset', author: 'Carol S. Dweck' },
  { id: 3, title: 'Zero to One', author: 'Peter Thiel' },
  { id: 4, title: 'The Psychology of Money', author: 'Morgan Housel' },
  { id: 5, title: 'The Lean Startup', author: 'Eric Ries' }
];


// Get route
app.get('/',(req,res)=>{
    res.json(books)
})

// soo aqri hal book
app.get('/books/:id', (req,res)=>{
    const bookId = books.find(book=> book.id == req.params.id);
        if(!bookId) return res.status(404).send("book not found")
    res.json(bookId)
})
// post rount
app.post('/books', (req,res)=>{
    const newBookdata = req.body;
        const newBook = {
                id: books.length +1,
                title: newBookdata.title,
                author: newBookdata.author
        }
books.push(newBook);
res.status(201).json(newBook)
})

// put route
app.put('/books/:id', (req,res)=>{
       const bookUpdate = books.find(book=> book.id == req.params.id);
            if(!bookUpdate) return res.status(404).send("User Not Found");
             bookUpdate.title = req.body.title;
             bookUpdate.author = req.body.author;
       res.json(bookUpdate)
})
// delete route
app.delete('/books/:id', (req,res)=>{
    const bookId = req.params.id
    books= books.filter(book=> book.id != req.params.id);
    res.send(`User ${bookId} Deleted Successfully`)
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
