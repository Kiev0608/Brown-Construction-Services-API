import { db } from "../config/firebase.config.js";
import client from "../config/paypal.config.js";
import paypal from "@paypal/checkout-server-sdk";

/**
 * 🧾 Create Invoice (from approved quotation)
 */
export const createInvoice = async (req, res) => {
  try {
    const { clientName, quotationId, items, totalAmount, dueDate, paymentMethod } = req.body;

    if (!clientName || !quotationId || !items || !totalAmount || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "clientName, quotationId, items, totalAmount, and dueDate are required.",
      });
    }

    const total = Number(totalAmount);
    if (isNaN(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid totalAmount. Must be a valid number greater than 0.",
      });
    }

    const newInvoice = {
      clientName,
      quotationId,
      items,                     // array of items
      totalAmount: total,         // ✅ fixed typo
      dueDate,
      paymentMethod: paymentMethod || "EFT",
      paymentReference: "",
      paymentStatus: "Pending",   // ✅ better default than “Unpaid”
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("invoices").add(newInvoice);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      id: docRef.id,
      data: newInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 📋 Get all invoices
 */
export const getAllInvoices = async (req, res) => {
  try {
    const snapshot = await db.collection("invoices").orderBy("createdAt", "desc").get();
    const invoices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error("Error getting invoices:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 🔍 Get single invoice
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("invoices").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Invoice not found" });
    }

    res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error getting invoice:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 💰 Update payment status manually
 */
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!["Pending", "Paid", "Overdue"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'Pending', 'Paid', or 'Overdue'.",
      });
    }

    await db.collection("invoices").doc(id).update({
      paymentStatus,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: `Invoice ${id} updated to ${paymentStatus}`,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * ❌ Delete invoice
 */
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("invoices").doc(id).delete();
    res.status(200).json({ success: true, message: "Invoice deleted successfully." });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 💳 Create PayPal Order
 */
export const createPaypalOrder = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const doc = await db.collection("invoices").doc(invoiceId).get();
    if (!doc.exists)
      return res.status(404).json({ success: false, error: "Invoice not found" });

    const invoice = doc.data();

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: invoice.totalAmount.toString(),
          },
          description: `Invoice #${invoiceId} for ${invoice.clientName}`,
        },
      ],
    });

    const order = await client.execute(request);

    // Optional: store PayPal orderId for reference
    await db.collection("invoices").doc(invoiceId).update({
      paypalOrderId: order.result.id,
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "PayPal order created successfully.",
      orderId: order.result.id,
      links: order.result.links,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 💳 Capture PayPal Payment
 */
export const capturePaypalPayment = async (req, res) => {
  try {
    const { orderId, invoiceId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);

    // ✅ Update invoice payment info
    await db.collection("invoices").doc(invoiceId).update({
      paymentStatus: "Paid",
      paymentReference: capture.result.id,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Payment captured and invoice updated.",
      capture,
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
