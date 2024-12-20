function errorsmiddleware(err, req, res) {
    res.status(500)
    res.json({
        message: err.message,
    })

}

module.exports = errorsmiddleware