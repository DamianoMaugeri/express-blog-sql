const posts = require('../data/posts.js')

// controllo l'ultimo id 
let lastid = posts.sort((a, b) => a.id - b.id).at(-1).id



//================================================================= INDEX  ===============================================================

const index = (req, res) => {

    let filteredPosts = posts

    // filtro i miei post con le informzaioni della query string e accetto un filtro sui tag ed un limite di contenuti da mostrare 

    //filter
    if (req.query.tag) {
        filteredPosts = posts.filter((post) => post.tags.map((tag) => tag.toLowerCase()).includes(req.query.tag.toLowerCase()));

    };

    //order   ordino il mio array in ordine alfabetico del titolo
    filteredPosts.sort((a, b) => a.title.localeCompare(b.title));

    //limit
    const limit = parseInt(req.query.limit)
    if (limit && !isNaN(limit) && limit >= 0) {
        filteredPosts = filteredPosts.slice(0, limit)
    }


    res.json(filteredPosts);
};


//===============================================================  SHOW  =======================================================

const showConId = (req, res) => {

    // se nel parametro ci sono solo numeri lo considero come id
    // faccio il parseint per trasfolmarlo in numero

    //const id = parseInt(req.params.id);
    // cerco nel mio array l'oggetto che ha una chiave id = a quel numero
    // find mi ritorna il primo elemento che soddisfa la callback o undefined

    //const post = posts.find((post) => post.id === id);

    // let result = post;

    // se post è undefined

    // if (!post) {
    //     res.status(404);
    //     result = {
    //         error: 'Post not found',
    //         message: `Non è presente nessun elemento con id: ${id}`

    //     }
    // }
    res.json({ ...req.post, nextId: req.next ? req.next.id : null, prevId: req.prev ? req.prev.id : null });
};

//-----------------------------------------------------------------------

const showConSlug = (req, res) => {

    // const slug = req.params.slug;

    // const post = posts.find((post) => post.slug === slug);

    // let result = post;

    // // se ho undefined
    // if (!post) {
    //     res.status(404);
    //     result = {
    //         error: 'Post not found',
    //         message: `Non è presente nessun elemento che corrisponde a: ${slug}`

    //     }
    // }
    res.json(req.post);

};
//================================================================  STORE  =============================================================

const store = (req, res) => {

    // controllo i dati in entrata , voglio come dati title,content,image,tags 
    const errors = validazioneTuttiICampi(req);

    if (errors.length > 0) {

        res.status(400);
        return res.json({
            error: 'ivalid request',
            message: errors
        });

    };

    // se sono corretti 

    const { title, content, image, tags, author } = req.body;

    lastid++;
    const slug = title.toLowerCase().trim().split(' ').join('-');

    const post = {
        id: lastid,
        title,
        slug,
        content,
        image,
        tags,
        author
    };

    posts.push(post);

    res.status(201).json(post)





};




//================================================================  UPDATE  ============================================================

const update = (req, res) => {

    // se nel parametro ci sono solo numeri lo considero come id
    // faccio il parseint per trasfolmarlo in numero

    // const id = parseInt(req.params.id);
    // cerco nel mio array l'oggetto che ha una chiave id = a quel numero
    // find mi ritorna il primo elemento che soddisfa la callback o undefined

    //const post = posts.find((post) => post.id === id);

    // se post è undefined

    // if (!post) {
    //     res.status(404);
    //     return res.json({
    //         error: 'Post not found',
    //         message: `Non è presente nessun elemento con id: ${id}`

    //     });
    // };

    // se ho trovato il post
    //verifico che tutti i parametri siano presenti 
    const post = req.post;

    const errors = validazioneTuttiICampi(req);

    if (errors.length > 0) {

        res.status(400);
        return res.json({
            error: 'ivalid request',
            message: errors
        });

    };


    // aggiorno il post 

    const { title, content, image, tags, author, isPublished } = req.body;
    const slug = title.toLowerCase().trim().split(' ').join('-');

    post.title = title;
    post.slug = slug;
    post.content = content;
    post.image = image;
    post.tags = tags;
    post.author = author;
    post.isPublished = isPublished;

    res.json(post)







};
//-------------------------------------------------------------------------------------------

const updateSlug = (req, res) => {

    let slug = req.params.slug;

    const post = posts.find((post) => post.slug === slug);

    // se ho undefined
    if (!post) {
        res.status(404);
        return res.json({
            error: 'Post not found',
            message: `Non è presente nessun elemento che corrisponde a: ${slug}`

        });
    };

    // se ho trovato il post
    //verifico che tutti i parametri siano presenti 

    const errors = validazioneTuttiICampi(req);

    if (errors.length > 0) {

        res.status(400);
        return res.json({
            error: 'ivalid request',
            message: errors
        });

    };


    // aggiorno il post 

    const { title, content, image, tags, author } = req.body;

    slug = title.toLowerCase().trim().split(' ').join('-');

    post.title = title;
    post.slug = slug;
    post.content = content;
    post.image = image;
    post.tags = tags;
    post.author = author;

    res.json(post)

}







//================================================================  MODIFY  ============================================================

const modify = (req, res) => {


    // se nel parametro ci sono solo numeri lo considero come id
    // faccio il parseint per trasfolmarlo in numero

    const id = parseInt(req.params.id);
    // cerco nel mio array l'oggetto che ha una chiave id = a quel numero
    // find mi ritorna il primo elemento che soddisfa la callback o undefined

    let post = posts.find((post) => post.id === id);

    // se post è undefined

    if (!post) {
        res.status(404);
        return res.json({
            error: 'Post not found',
            message: `Non è presente nessun elemento con id: ${id}`

        })
    }

    // se ho trovato il post 
    post = modifypost(post, req);


    res.json(post);

};

//---------------------------------------------------------------------------------------------------------------------------------------------

const modifySlug = (req, res) => {

    let slug = req.params.slug;

    let post = posts.find((post) => post.slug === slug);

    // se ho undefined
    if (!post) {
        res.status(404);
        return res.json({
            error: 'Post not found',
            message: `Non è presente nessun elemento che corrisponde a: ${slug}`

        });
    };

    post = modifypost(post, req);

    res.json(post);

};




//================================================================  DESTROY ============================================================

const destroyConId = (req, res) => {
    const id = parseInt(req.params.id);

    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
        res.status(404);
        return res.json(
            {
                error: 'Post not found',
                message: `Non è presente nessun elemento che corrisponde a: ${slug}`
            }
        )
    };

    posts.splice(postIndex, 1);
    res.sendStatus(204);

};

//--------------------------------------------------------------------------------

const destroyConSlug = (req, res) => {
    const slug = req.params.slug;

    const postIndex = posts.findIndex((post) => post.slug === slug);

    if (postIndex === -1) {
        res.status(404);
        return res.json(
            {
                error: 'Post not found',
                message: `Non è presente nessun elemento che corrisponde a: ${slug}`
            }
        )
    };

    posts.splice(postIndex, 1);
    res.sendStatus(204);

};


module.exports = { index, showConId, showConSlug, store, update, updateSlug, modify, modifySlug, destroyConId, destroyConSlug }









function validazioneTuttiICampi(req) {
    const { title, content, image = '', tags } = req.body;

    const errors = []


    if (!title) {
        errors.push('title is required')
    }

    if (!content && content.length >= 1000) {
        errors.push('content is reqired')
    }

    // if (!image) {
    //     errors.push('Image is required')
    // }

    if (!tags) {
        errors.push('tags is required')
    }

    return errors


};


function modifypost(post, req) {
    const { title, content, image, tags } = req.body;
    let slug;

    // se ho valori che non sono undefined modifico il mio post

    if (title) {
        post.title = title;
        slug = title.toLowerCase().trim().split(' ').join('-');
        post.slug = slug;

    };
    if (content) {
        post.content = content;
    };
    if (image) {
        post.image = image;
    };
    if (tags) {
        post.tags = tags;
    };

    return post

};