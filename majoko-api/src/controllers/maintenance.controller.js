import { db } from "../config/firebase.config.js";

/**
 * 1️⃣ Client: Create a new maintenance request
 * Body: { clientName, description, imageUrl }
 */
export const createRequest = async (req, res) => {
  try {
    const { clientName, description, imageUrl } = req.body;

    if (!clientName || !description) {
      return res.status(400).json({
        success: false,
        error: "Client name and description are required.",
      });
    }

    const newRequest = {
      clientName,
      description,
      imageUrl: imageUrl || null,
      assignedContractor: null, // not yet assigned
      status: "Pending", // default
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("maintenanceRequests").add(newRequest);

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully.",
      id: docRef.id,
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 2️⃣ Admin: Assign a contractor to a request
 * Params: id
 * Body: { assignedContractor }
 */
export const assignContractor = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedContractor } = req.body;

    if (!assignedContractor) {
      return res.status(400).json({
        success: false,
        error: "Assigned contractor name is required.",
      });
    }

    const docRef = db.collection("maintenanceRequests").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Request not found." });
    }

    await docRef.update({ assignedContractor, status: "In Progress" });

    res.status(200).json({
      success: true,
      message: "Contractor assigned successfully.",
      id,
      assignedContractor,
      newStatus: "In Progress",
    });
  } catch (error) {
    console.error("Error assigning contractor:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3️⃣ Contractor/Admin: Update the task status
 * Params: id
 * Body: { status } — ("Pending", "In Progress", "Completed")
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be Pending, In Progress, or Completed.",
      });
    }

    const docRef = db.collection("maintenanceRequests").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ success: false, error: "Request not found." });
    }

    await docRef.update({ status });

    res.status(200).json({
      success: true,
      message: "Maintenance request status updated successfully.",
      id,
      newStatus: status,
    });
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4️⃣ View all requests (for any dashboard)
 */
export const getAllRequests = async (req, res) => {
  try {
    const snapshot = await db
      .collection("maintenanceRequests")
      .orderBy("createdAt", "desc")
      .get();

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};