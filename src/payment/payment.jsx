import React, { useState } from 'react';
import { db } from "../firebase";
import { collection, doc, updateDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Displaypaid from './Displaypaid';

function Payment() {
  const [studentId, setStudentId] = useState("");
  const [paid, setPaid] = useState("");
  const [date, setDate] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const pay = async () => {
    if (!studentId || !paid) {
      showAlert('Please enter both Student ID and Payment Amount', 'error');
      return;
    }

    try {
      const studentQuery = query(
        collection(db, "students"),
        where("id", "==", parseInt(studentId))
      );
      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        showAlert('No student found with this ID', 'error');
        return;
      }

      const studentDoc = studentSnapshot.docs[0];
      const studentRef = doc(db, "students", studentDoc.id);
      const currentPaid = studentDoc.data().paid || 0;

      await addDoc(collection(db, 'payment'), {
        studentId: parseInt(studentId),
        paid: parseInt(paid),
        date
      });

      const newPaymentAmount = currentPaid + parseInt(paid);
      await updateDoc(studentRef, {
        paid: newPaymentAmount
      });

      showAlert('Payment successful', 'success');
      setStudentId("");
      setPaid("");
      setDate("");
    } catch (error) {
      console.error('Error in payment', error);
      showAlert('Payment failed. Please try again.', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {alertMessage && (
        <div className={`
          flex items-center p-4 mb-4 rounded-lg 
          ${alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}>
          {alertType === 'success' ? (
            <CheckCircle2 className="mr-3" />
          ) : (
            <AlertCircle className="mr-3" />
          )}
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Payment</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="number"
              placeholder="Enter Student ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Payment Amount</label>
            <input
              type="number"
              placeholder="Enter Payment Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={pay}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Payment
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Displaypaid />
      </div>
    </div>
  );
}

export default Payment;