const Book = require('../models/Book'); // Importation du modèle Book
const fs = require('fs'); // fs (file system) est un package de Node pour modifier le système de fichiers

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
    console.log('getAllBooks appelé'); // Pour vérifier que la méthode est appelée
    try {
        const books = await Book.find(); // Récupérer tous les livres
        res.status(200).json(books); // Retourner les livres au format JSON
    } catch (err) {
        console.error(err); // Log l'erreur pour le débogage
        res.status(500).json({ message: 'Erreur lors de la récupération des livres' });
    }
};

// Ajouter un nouveau livre
exports.addBook = (req, res) => {
     // L'objet requête va être parsé, car l'objet est sous forme de chaines de caractères
    let bookObject;
    try {
        bookObject = JSON.parse(req.body.book); // Essayer de parser le livre
        console.log("Objet livre reçu :", bookObject); // Log de l'objet livre
    } catch (error) {
        return res.status(400).json({ message: 'Erreur lors du parsing du livre' });
    }

    // On supprime l'id du fichier, car l'id sera générée automatiquement par la BDD
    delete bookObject._id;
    delete bookObject._userId;

    // Création de l'instance Book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId, // Assurez-vous que req.auth.userId est correctement défini
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null // URL de l'image mise à jour
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré !' });
        })
        .catch(error => {
            console.error("Erreur lors de l'enregistrement du livre :", error); // Log d'erreur
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
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la récupération du livre' }); // Gestion des erreurs
    }
};

// Modifier un livre
exports.modifyBook = async (req, res) => {
    let bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;

    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book.userId != req.auth.userId) {
            return res.status(403).json({ message: 'Not authorized' }); // Changement au code 403
        } 

        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
        res.status(200).json({ message: 'Livre modifié!' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book.userId != req.auth.userId) {
            return res.status(403).json({ message: 'Non autorisé' }); // Changement au code 403
        } 

        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async (unlinkError) => {
            if (unlinkError) {
                console.error(unlinkError);
                return res.status(500).json({ message: 'Erreur lors de la suppression de l\'image' });
            }
            await Book.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Objet supprimé !' });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};