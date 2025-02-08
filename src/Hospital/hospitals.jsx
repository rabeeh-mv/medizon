import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import Alert from "../operations/Alert";

// Design system colors
const colors = {
  primary: '#1A3C40',    // Deep Forest Green
  secondary: '#417D7A',  // Muted Teal
  accent: '#9DC3C1',     // Soft Mint
  background: '#F5F7F8', // Light Gray
  text: '#2D2D2D',       // Dark Gray
  lightText: '#5D5D5D'   // Medium Gray
};

function Hospitals() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [alertInfo, setAlertInfo] = useState("");
  const [editedHospital, setEditedHospital] = useState(null);
  // New state for mobile menu visibility
  const [isMobileActionsVisible, setIsMobileActionsVisible] = useState(null);

  const showAlert = (message) => {
    setAlertInfo(message);
    setTimeout(() => setAlertInfo(""), 3000);
  };

  const addHospital = async () => {
    if (!name.trim()) {
      showAlert("Please enter a valid hospital name");
      return;
    }

    try {
      const hospitalQuery = query(
        collection(db, "hospitals"), 
        where("name", "==", name.trim())
      );
      const querySnapshot = await getDocs(hospitalQuery);

      if (!querySnapshot.empty) {
        showAlert(`A hospital named ${name} already exists.`);
        return;
      }

      await addDoc(collection(db, "hospitals"), {
        name: name.trim(),
        number: number.trim(),
      });
      showAlert("Hospital added successfully");
      resetForm();
      fetchHospitals();
    } catch (error) {
      console.error("Error:", error);
      showAlert("Failed to add hospital");
    }
  };

  const fetchHospitals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hospitals"));
      const hospitalList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHospitals(hospitalList);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      showAlert("Failed to fetch hospitals");
    }
  };

  const deleteHospital = async (docId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await deleteDoc(doc(db, "hospitals", docId));
        showAlert("Hospital deleted successfully");
        fetchHospitals();
        setIsMobileActionsVisible(null); // Hide mobile actions after deletion
      } catch (error) {
        console.error("Error deleting hospital:", error);
        showAlert("Failed to delete hospital");
      }
    }
  };

  const editHospital = (hospital) => {
    setEditedHospital(hospital);
    setIsMobileActionsVisible(null); // Hide mobile actions when editing
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateHospital = async () => {
    if (!editedHospital) return;
    try {
      const hospitalRef = doc(db, "hospitals", editedHospital.id);
      await updateDoc(hospitalRef, {
        name: name.trim(),
        number: number.trim(),
      });
      showAlert("Hospital updated successfully");
      resetForm();
      fetchHospitals();
    } catch (error) {
      console.error("Error updating hospital:", error);
      showAlert("Failed to update hospital");
    }
  };

  const resetForm = () => {
    setName("");
    setNumber("");
    setEditedHospital(null);
  };

  useEffect(() => {
    if (editedHospital) {
      setName(editedHospital.name);
      setNumber(editedHospital.number);
    }
  }, [editedHospital]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ backgroundColor: colors.background }}>
      {/* Alert positioned fixed on mobile */}
      <div className="fixed top-4 left-4 right-4 z-50 sm:relative sm:top-0 sm:left-0 sm:right-0">
        <Alert alert={alertInfo} />
      </div>
      
      {/* Form Section */}
      <div className="rounded-xl shadow-sm p-4 sm:p-6" style={{ backgroundColor: 'white' }}>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: colors.primary }}>
          {editedHospital ? "Edit Hospital" : "Add New Hospital"}
        </h2>

        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
          {/* Hospital Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: colors.text }}>
              Hospital Name
            </label>
            <input
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none text-sm sm:text-base"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              type="text"
              placeholder="Enter hospital name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: colors.text }}>
              Contact Number
            </label>
            <input
              className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none text-sm sm:text-base"
              style={{
                borderColor: colors.accent,
                focusBorderColor: colors.primary,
                focusRingColor: colors.accent
              }}
              type="text"
              placeholder="Enter contact number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition-colors hover:bg-opacity-90 text-sm sm:text-base"
            style={{ backgroundColor: colors.primary }}
            onClick={editedHospital ? updateHospital : addHospital}
          >
            {editedHospital ? "Update Hospital" : "Add Hospital"}
          </button>
          
          {editedHospital && (
            <button
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium border transition-colors hover:bg-gray-50 text-sm sm:text-base"
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

      {/* Hospitals List */}
      <div className="rounded-xl shadow-sm p-4 sm:p-6 bg-white">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: colors.primary }}>
          Hospital Directory
        </h2>
        
        <div className="space-y-4">
          {hospitals.length === 0 ? (
            <p className="text-center py-4 text-sm sm:text-base" style={{ color: colors.lightText }}>
              No hospitals added yet
            </p>
          ) : (
            hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="relative rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderBottom: `1px solid ${colors.accent}` }}
              >
                {/* Hospital Info */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm sm:text-base" style={{ color: colors.text }}>
                      {hospital.name}
                    </h3>
                    <p className="text-sm" style={{ color: colors.lightText }}>
                      {hospital.number}
                    </p>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden sm:flex sm:gap-3">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ color: colors.secondary }}
                      onClick={() => editHospital(hospital)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      onClick={() => deleteHospital(hospital.id)}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Mobile Actions Toggle */}
                  <button
                    className="absolute top-4 right-4 sm:hidden p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsMobileActionsVisible(
                      isMobileActionsVisible === hospital.id ? null : hospital.id
                    )}
                    style={{ color: colors.primary }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {/* Mobile Actions Dropdown */}
                  {isMobileActionsVisible === hospital.id && (
                    <div className="absolute right-4 top-12 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 sm:hidden">
                      <div className="py-1">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                          style={{ color: colors.secondary }}
                          onClick={() => editHospital(hospital)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          onClick={() => deleteHospital(hospital.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Hospitals;