const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../firebase-config.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const usersCollection = db.collection('users');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      const newUser = { name, email, created_at: new Date() };
      const addedDoc = await usersCollection.add(newUser);
      res.status(200).json({ id: addedDoc.id, ...newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  else if (req.method === 'GET') {
    try {
      const snapshot = await usersCollection.get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  else {
    res.status(405).json({ error: 'الطريقة غير مسموحة' });
  }
};
