const express = require('express');

const app = express();

const port = 3000;

const postsRouter = require('./routers/posts.js');

const descriptionRouter = require('./routers/description.js')

const notFound = require('./middlewares/notFound.js');

const errorsmiddleware = require('./middlewares/errorMiddleware.js')

const cors = require('cors')





app.use(cors())
app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('home del server');
});



//rotte
app.use('/posts', postsRouter);
app.use('/description', descriptionRouter)


// middlewares finali

app.use(errorsmiddleware)
app.use(notFound);





app.listen(port, () => {
    console.log('hello nel listen');
})

process.on('SIGINT', () => {
    app.close();
    process.exit(0);
});
