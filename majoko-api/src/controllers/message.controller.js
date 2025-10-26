import { db } from "../config/firebase.config.js";

// Create a message
export const createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, projectId, subject, body } = req.body;

    if (!senderId || !receiverId || !body) {
      return res.status(400).json({ success: false, error: "senderId, receiverId, and body are required" });
    }

    const newMessage = {
      senderId,
      receiverId,
      projectId: projectId || null,
      subject: subject || "",
      body,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("messages").add(newMessage);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      id: docRef.id,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get messages for a user
export const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection("messages")
      .where("receiverId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark a message as read
export const markMessageRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    await db.collection("messages").doc(messageId).update({ isRead: true });

    res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
