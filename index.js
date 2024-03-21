import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv"

const app = express();
const port = 3000;
env.config();

//connect to database
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//homepage - Show listed books
app.get('/', async (req,res) => {
    const result = await db.query('SELECT * FROM book ORDER BY rating DESC');
    const books = result.rows;
    res.render('index.ejs', {books: books})
});

//Book detail page
app.get('/book/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const result = await db.query('SELECT * FROM book WHERE id=$1', [id]);
    const book = result.rows[0];
    res.render('books-detail.ejs', {book: book});
});

//Form page to add newbook
app.get('/newbook', (req,res) => {
    res.render('newbook.ejs');
});

//Add new book
app.post('/addbook', async (req, res) => {
    const name = req.body.bookName;
    const date = req.body.bookReadDate;
    const notes = req.body.bookNote;
    const isbn = req.body.bookIsbn;
    const rating = req.body.bookRating;

    await db.query('INSERT INTO book (name,read_date,rating,notes,isbn) VALUES ($1,$2,$3,$4,$5)',
    [name, date, rating, notes, isbn]);
    
    res.redirect('/')
});

//Edit book
app.post('/edit', async (req,res) => {
    const updatedNotes = req.body.updatedNote;
    const id = req.body.updatedBookId;
    try {
        await db.query('UPDATE book SET notes=$1 WHERE id=$2', [updatedNotes, id])
        res.redirect(`/book/${id}`);
    } catch (err) {
        console.log(err)
        const result = await db.query('SELECT * FROM book WHERE id=$1', [id]);
        const book = result.rows[0];
        res.render('books-detail.ejs', {book: book, error: "O texto ultrapassou o limite de caracteres. Tente novamente"});
    }
});

//Delete book
app.post('/delete', async (req,res) => {
        const id = req.body.bookDelete;
    if (id) {
        await db.query('DELETE FROM book WHERE id = $1', [id]);
        res.redirect('/');
    } else {
        const id = req.body.bookDeleteCancel;
        res.redirect(`/book/${id}`);
    };
});


app.listen(port, () => {
    console.log(`Server runing on port http://localhost:${port}`)
});