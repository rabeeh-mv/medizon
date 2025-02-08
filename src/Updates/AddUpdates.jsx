import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Alert from "../operations/Alert";
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from "firebase/firestore";
import DisplayUpdates from "./DisplayUpdates";

const colors = {
  primary: '#1A3C40',       // Deep Forest Green
  secondary: '#417D7A',     // Muted Teal
  accent: '#9DC3C1',        // Soft Mint
  background: '#F5F7F8',    // Light Gray
  text: '#2D2D2D',          // Dark Gray
  lightText: '#5D5D5D'      // Medium Gray
};

function AddUpdates() {
  const [formData, setFormData] = useState({
    studentId: "",
    hospitalId: "",
    reason: "",
    date: "",
    amount: ""
  });
  const [hospitals, setHospitals] = useState([]);
  const [alertInfo, setAlertInfo] = useState();

  const fetchHospitals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hospitals"));
      const hospitalList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHospitals(hospitalList);
    } catch (error) {
      console.error("Error fetching hospitals: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addUpdate = async () => {
    const { studentId, hospitalId, date, amount } = formData;
    if (!studentId || !hospitalId || !date || !amount) {
      setAlertInfo("Please fill in all required fields!");
      return;
    }

    try {
      const studentQuery = query(
        collection(db, "students"),
        where("id", "==", parseInt(studentId))
      );
      const studentSnapshot = await getDocs(studentQuery);

      if (studentSnapshot.empty) {
        setAlertInfo("Student not found!");
        return;
      }

      const studentDoc = studentSnapshot.docs[0];
      const studentRef = doc(db, "students", studentDoc.id);
      const currentAmount = studentDoc.data().amount || 0;

      await addDoc(collection(db, "updates"), {
        studentId: parseInt(studentId),
        hospitalId,
        reason: formData.reason,
        date,
        amount: parseInt(amount),
      });

      const newTotalAmount = currentAmount + parseInt(amount);
      await updateDoc(studentRef, { amount: newTotalAmount });

      setAlertInfo("Update added successfully!");
      setFormData({ studentId: "", hospitalId: "", reason: "", date: "", amount: "" });
    } catch (error) {
      console.error("Error adding update: ", error);
      setAlertInfo("Failed to add update. Please try again.");
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: colors.background }}>
      <Alert alert={alertInfo} />
      
      {/* Form Section */}
      <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'white' }}>
        <h2 className="text-xl font-semibold mb-6" style={{ color: colors.primary }}>
          Add Medical Update
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Student ID
            </label>
            <input
              name="studentId"
              type="number"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              placeholder="Enter Student ID"
              value={formData.studentId}
              onChange={handleInputChange}
            />
          </div>

          {/* Hospital Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Hospital
            </label>
            <select
              name="hospitalId"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              value={formData.hospitalId}
              onChange={handleInputChange}
            >
              <option value="">Select Hospital</option>
              {hospitals.map((hospital) => (
                <option 
                  key={hospital.id} 
                  value={hospital.id}
                  className="py-2 hover:bg-gray-100"
                >
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Date
            </label>
            <input
              name="date"
              type="date"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Amount
            </label>
            <input
              name="amount"
              type="number"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>

          {/* Reason (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Reason
            </label>
            <textarea
              name="reason"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none h-32"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              placeholder="Enter Reason"
              value={formData.reason}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: colors.primary }}
            onClick={addUpdate}
          >
            Add Update
          </button>
        </div>
      </div>

      {/* Display Updates Section */}
      <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'white' }}>
        <DisplayUpdates colors={colors} />
      </div>
    </div>
  );
}

export default AddUpdates;