const Book = require('../models/Book'); // Importation du modèle Book


// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find(); // Interroger la base de données pour obtenir tous les livres
        res.status(200).json(books); // Retourner les livres sous forme de JSON
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres' }); // Gestion des erreurs
    }
};

// Ajouter un nouveau livre
exports.addBook = (req, res) => {
    const bookObject = {
        userId: req.body.userId, // Il vient de votre corps de requête
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre,
        ratings: [], // Ici, vous pouvez initialiser un tableau de notations vide
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // URL de l'image mise à jour
    };

    const book = new Book(bookObject); // Créer une instance du modèle avec les données

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré !' });
        })
        .catch(error => {
            res.status(400).json({ error });
        });
};

// Récupérer un livre par ID
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Trouver le livre par ID
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' }); // Si le livre n'existe pas
        }
        res.status(200).json(book); // Retourner le livre trouvé
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre' }); // Gestion des erreurs
    }
};