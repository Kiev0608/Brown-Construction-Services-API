const { db } = require('../config/firebase.config');

const createRequest = async (req, res) => {
  const { title, description, images } = req.body;
  const userId = req.user.id; // From JWT middleware

  try {
    const docRef = await db.collection('maintenanceRequests').add({
      title,
      description,
      images: images || [],
      status: 'Pending',
      assignedTo: null,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const snapshot = await db.collection('maintenanceRequests').get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  try {
    const docRef = db.collection('maintenanceRequests').doc(id);
    await docRef.update({
      status,
      assignedTo: assignedTo || null,
      updatedAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createRequest, getRequests, updateStatus };
