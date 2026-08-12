# YanisGPT

Un vrai site de chat IA responsive, pensé pour téléphone et ordinateur.

## Ce qu'il contient

- Interface sombre inspirée de la maquette YanisGPT
- Nouvelles discussions et historique local
- Suggestions de questions
- Réponses IA réelles via l'API OpenAI Responses
- Clé API gardée côté serveur (elle n'est jamais mise dans le navigateur)
- Compatible téléphone

## Lancer le site

1. Installe Node.js 18+.
2. Dans le dossier du projet :
   `npm install`
3. Copie `.env.example` en `.env`.
4. Mets ta clé API OpenAI dans `OPENAI_API_KEY`.
5. Lance :
   `npm start`
6. Ouvre `http://localhost:3000`.

Pour le mettre sur Internet, déploie ce dossier sur un hébergeur Node.js (par exemple Render, Railway ou un VPS) et ajoute `OPENAI_API_KEY` dans les variables d'environnement de l'hébergeur.

Important : ne mets jamais ta clé OpenAI directement dans `public/app.js` ou dans le HTML.
