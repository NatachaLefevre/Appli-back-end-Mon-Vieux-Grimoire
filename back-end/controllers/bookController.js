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
exports.addBook = async (req, res) => {
    const { title, author, year, genre, imageUrl, userId } = req.body;
    const book = new Book({ title, author, year, genre, imageUrl, userId }); // Créer un nouveau livre
    try {
        await book.save(); // Sauvegarder le livre dans la base de données
        res.status(201).json(book); // Retourner le livre créé
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création du livre' }); // Gestion des erreurs
    }
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

// Vous pouvez également ajouter les méthodes pour modifier et supprimer un livre ici