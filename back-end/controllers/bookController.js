const { log } = require('console');

// Importation du modèle Book
const Book = require('../models/Book');

// fs (file system) est un package de Node pour modifier le système de fichiers
const fs = require('fs');


// RÉCUPÉRER TOUS LES LIVRES

exports.getAllBooks = async (req, res) => {

    console.log("getAllBooks appelé");
    // Pour vérifier que la méthode est appelée

    try {
        // Récupérer tous les livres
        const books = await Book.find();

        // Retourner les livres au format JSON
        res.status(200).json(books);

    } catch (error) {
        // Log l'erreur pour le débogage
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
};


// AJOUTER UN NOUVEAU LIVRE

exports.addBook = (req, res) => {

    // L'objet requête va être parsé, car l'objet est sous forme de chaines de caractères
    let bookObject;

    try {
        // Essayer de parser le livre
        bookObject = JSON.parse(req.body.book);
        console.log("Objet livre reçu :", bookObject);
        // Log de l'objet livre

    } catch (error) {
        return res.status(400).json({ message: "Erreur lors du parsing du livre" });
    }

    // On supprime l'id du fichier, car l'id sera générée automatiquement par la BDD
    delete bookObject._id;
    delete bookObject._userId;

    // Création de l'instance Book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
        // // URL de l'image mise à jour
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "Livre enregistré !" });
        })
        .catch(error => {
            console.error("Erreur lors de l'enregistrement du livre :", error);
            res.status(400).json({ error });
        });
};


// RÉCUPÉRER UN LIVRE PAR ID

exports.getOneBook = async (req, res) => {

    try {
        // Trouver le livre par ID
        const book = await Book.findById(req.params.id);

        if (!book) {
            // Si le livre n'existe pas
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        // Retourner le livre trouvé
        res.status(200).json(book);

        // Pour appeler une erreur, on appelle "err", "error" ou "e" par convention.
        // Ils veulent dire la même chose. On peut écrire ce qu'on veut, tant qu'on appelle la même chose dans la console.
        // Idéalement conserver le même terme sur tout le projet, par cohérence et facilité de lecture.
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'enregistement du livre", error }); // Gestion des erreurs
    }
};


// MODIFIER UN LIVRE

exports.modifyBook = async (req, res) => {

    let bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;

    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId != req.auth.userId) {

            // Changement au code 403
            return res.status(403).json({ message: "Non autorisé" });
        }

        //Si nouvelle image, après modif d'un livre
        if (req.file) {

            // Suppression de l'ancienne image (éco-conception)
            const filename = book.imageUrl.split('/images/')[1];

            fs.unlink(`images/${filename}`, async (error) => {

                if (error) {
                    return res.status(500).json({ error: "Erreur lors de la suppression de l'image" });
                }
                console.log(`L'ancienne image ${filename} a été supprimée avec succès.`);
                
                bookObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

                try {
                    await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

                    return res.status(200).json({ message: "Livre modifié" });
                }
                catch (error) {
                    return res.status(500).json({ error });
                }
            });
        }

        else {
            try {
                await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

                return res.status(200).json({ message: "Livre modifié" });
            }
            catch (error) {
                return res.status(500).json({ error });
            }
        }
    }
    catch (error) {
        return res.status(400).json({ error });
    }
};


// SUPPRIMER UN LIVRE

exports.deleteBook = async (req, res) => {

    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (book.userId != req.auth.userId) {

            // Changement au code 403
            return res.status(403).json({ message: "Non autorisé" });
        }

        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async (unlinkError) => {

            if (unlinkError) {
                console.error(unlinkError);

                return res.status(500).json({ message: "Erreur lors de la suppression de l'image" });
            }

            await Book.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "Objet supprimé !" });
        });

    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.rateBook = async (req, res) => {

    try {
        // -- On récupère le bookId à partir du paramètre de la requête
        const bookId = req.params.id;

        // -- Destructurer le corps de la requête
        const { userId, rating } = req.body;

        // -- Récupérer le livre via son id
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Livre introuvable" });
        }

        // -- Récupérer la liste des notations et les attribuer à une variable
        const bookRatings = book.ratings;

        // -- Vérifier dans la liste si l'utilisateur a déjà noté ce livre 
        // (si oui: renvoyer une erreur 400, si non: ajouter la notation au tableau)
        const alreadyRated = bookRatings.find((rating) => rating.userId === userId);

        if (alreadyRated) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
        }

        bookRatings.push({ userId, grade: rating });

        // Mettre à jour le averageRating
        let averageRating = 0;

        bookRatings.forEach((rating) => {
            averageRating += rating.grade;
        })

        averageRating = averageRating / bookRatings.length;

        // Si la notation a été ajoutée au tableau alors, 
        // sauvegarder les modifications et renvoyer un message de succès
        await Book.updateOne({ _id: bookId }, { ratings: bookRatings, averageRating: averageRating.toFixed(1) });

        const updatedBook = await Book.findById(bookId);

        return res.status(200).json(updatedBook);

    } catch (error) {
        console.error("rateBook error :", error)
        return res.status(500).json({ message: "Une erreur est survenue lors de la notation du livre", error: error })
    }
}


// RÉCUPÉRER LES LIVRES AVEC LES MEILLEURES NOTATIONS

exports.getBestRatedBooks = async (req, res) => {

    try {
        console.log("Voici les 3 livres les mieux notés", res, req);

        const bestRatedBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
        // average -1 veut dire qu'il va chercher tous les livres à partir du dernier en ligne. 
        // limit 3 = 3 livres maxi

        res.status(200).json(bestRatedBooks);

    } catch (error) {
        console.error("Erreur lors de la récupération des meilleurs livres :", error.message);
        res.status(500).json({ message: "Erreur lors de la récupération des meilleurs livres.", error: error.message });
    }
};