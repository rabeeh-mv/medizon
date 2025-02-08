import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Alert from "../operations/Alert";
import { Trash2 } from "lucide-react";

// Color palette
const colors = {
  primary: '#1A3C40',       // Deep Forest Green
  secondary: '#417D7A',     // Muted Teal
  accent: '#9DC3C1',        // Soft Mint
  background: '#F5F7F8',    // Light Gray
  text: '#2D2D2D',          // Dark Gray
  lightText: '#5D5D5D'      // Medium Gray
};

function Displaypaid() {
  const [payments, setPayments] = useState([]);
  const [alertinfo, setAlertinfo] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch payments from Firestore
  const fetchPayments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "payment"));
      const paymentList = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setPayments(paymentList);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setAlertinfo("Failed to fetch payments. Please try again.");
    }
  };

  // Handle delete confirmation
  const handleDeleteStudent = (docId) => {
    setShowConfirmDelete(true);
    setStudentToDelete(docId);
  };

  // Confirm and process deletion
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      // Fetch the payment record
      const paymentRef = doc(db, "payment", studentToDelete);
      const paymentSnapshot = await getDoc(paymentRef);

      if (paymentSnapshot.exists()) {
        const payment = paymentSnapshot.data();

        // Fetch the student record
        const studentQuery = query(
          collection(db, "students"),
          where("id", "==", payment.studentId)
        );
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentRef = doc(db, "students", studentDoc.id);
          const currentPaid = studentDoc.data().paid || 0;

          // Update the student's paid amount
          const updatedPaid = Math.max(0, currentPaid - parseInt(payment.paid));
          await updateDoc(studentRef, { paid: updatedPaid });
        }

        // Delete the payment record
        await deleteDoc(paymentRef);
        setAlertinfo("Payment deleted successfully.");
        fetchPayments(); // Refresh the list
      } else {
        setAlertinfo("Payment record not found.");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      setAlertinfo("Failed to delete payment. Please try again.");
    } finally {
      setShowConfirmDelete(false);
      setStudentToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setStudentToDelete(null);
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: colors.background }}>
      {/* Alert for messages */}
      <Alert alert={alertinfo} />

      {/* Delete Confirmation Dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
              Confirm Deletion
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.lightText }}>
              Are you sure you want to delete this payment record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  color: colors.primary,
                  backgroundColor: colors.accent,
                  hoverBackgroundColor: colors.secondary
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.primary,
                  hoverBackgroundColor: colors.secondary
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: colors.primary }}>
        <h2 className="text-xl font-semibold text-center text-white">
          Payment Records
        </h2>
        <p className="text-sm text-center mt-2" style={{ color: colors.accent }}>
          {payments.length} registered payments
        </p>
      </div>

      {/* Payments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.length > 0 ? (
          payments.map((pay) => (
            <div 
              key={pay.docId} 
              className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: colors.accent }}
            >
              <div className="flex flex-col space-y-3">
                {/* Payment Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: colors.text }}>
                      Student ID: {pay.studentId}
                    </h3>
                    <p className="text-xs" style={{ color: colors.lightText }}>
                      Date: {pay.date}
                    </p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: colors.primary }}>
                    ₹{pay.paid}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteStudent(pay.docId)}
                  className="self-end px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                  style={{
                    color: colors.primary,
                    backgroundColor: 'rgba(157, 195, 193, 0.3)',
                    hoverBackgroundColor: 'rgba(157, 195, 193, 0.5)'
                  }}
                >
                <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div 
            className="col-span-full p-6 text-center rounded-xl"
            style={{ backgroundColor: colors.accent }}
          >
            <p className="text-sm" style={{ color: colors.lightText }}>
              No payment records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Displaypaid;