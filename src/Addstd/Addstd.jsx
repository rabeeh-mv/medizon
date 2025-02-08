import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore config
import { collection, where, getDocs, query, addDoc, doc, updateDoc } from "firebase/firestore";
import DisplayStd from "./Dispalystd";
import Alert from "../operations/Alert";

// Using your existing color palette
const colors = {
  primary: '#1A3C40',       // Deep Forest Green
  secondary: '#417D7A',     // Muted Teal
  accent: '#9DC3C1',        // Soft Mint
  background: '#F5F7F8',    // Light Gray
  text: '#2D2D2D',          // Dark Gray
  lightText: '#5D5D5D'      // Medium Gray
};

function Addstd() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState("");
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [alertinfo, setAlertinfo] = useState("");

  const addStd = async () => {
    if (!id || !name) {
      setAlertinfo("Please enter a valid ID and name");
      return;
    }

    try {
      const studentQuery = query(collection(db, "students"), where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(studentQuery);

      if (!querySnapshot.empty) {
        setAlertinfo(`A student with ID ${id} already exists.`);
        return;
      }

      await addDoc(collection(db, "students"), {
        id: parseInt(id),
        name: name || "Unknown",
      });

      setAlertinfo("Student added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding student:", error);
      setAlertinfo("Failed to add student.");
    }
  };

  const updateStd = async () => {
    if (!studentToEdit) return;
    try {
      const studentRef = doc(db, "students", studentToEdit.docId);
      await updateDoc(studentRef, {
        id: isNaN(parseInt(id)) ? 0 : parseInt(id),
        name,
        amount: isNaN(parseInt(amount)) ? 0 : parseInt(amount),
        paid: isNaN(parseInt(paid)) ? 0 : parseInt(paid),
      });
      setAlertinfo("Student updated successfully");
      resetForm();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const resetForm = () => {
    setId("");
    setName("");
    setAmount("");
    setPaid("");
    setStudentToEdit(null);
  };

  useEffect(() => {
    if (studentToEdit) {
      setId(studentToEdit.id);
      setName(studentToEdit.name);
      setAmount(studentToEdit.amount);
      setPaid(studentToEdit.paid);
    }
  }, [studentToEdit]);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: colors.background }}>
      <Alert alert={alertinfo} />
      
      {/* Form Section */}
      <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'white' }}>
        <h2 className="text-xl font-semibold mb-6" style={{ color: colors.primary }}>
          {studentToEdit ? "Edit Student" : "Add New Student"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Student ID
            </label>
            <input
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              type="number"
              placeholder="Student ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!studentToEdit}
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
              Student Name
            </label>
            <input
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: colors.primary }}
            onClick={studentToEdit ? updateStd : addStd}
          >
            {studentToEdit ? "Update Student" : "Add Student"}
          </button>
          
          {studentToEdit && (
            <button
              className="px-6 py-2 rounded-lg font-medium border transition-colors hover:bg-gray-50"
              style={{
                borderColor: colors.primary,
                color: colors.primary
              }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Display Students Table */}
      <DisplayStd 
        Addstd={addStd} 
        updateStd={updateStd} 
        setStudentToEdit={setStudentToEdit} 
        colors={colors}
      />
    </div>
  );
}

export default Addstd;