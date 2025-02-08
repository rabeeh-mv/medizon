import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Trash2, Edit2 } from "lucide-react";
import { db } from "../firebase";

function DisplayUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      const updatesSnapshot = await getDocs(collection(db, "updates"));
      const updatesWithHospitalNames = [];

      for (const updateDoc of updatesSnapshot.docs) {
        const updateData = updateDoc.data();

        let hospitalName = "Unknown Hospital";
        if (updateData.hospitalId) {
          const hospitalRef = doc(db, "hospitals", updateData.hospitalId);
          const hospitalSnapshot = await getDoc(hospitalRef);

          if (hospitalSnapshot.exists()) {
            hospitalName = hospitalSnapshot.data().name;
          }
        }

        updatesWithHospitalNames.push({
          id: updateDoc.id,
          ...updateData,
          hospitalName,
        });
      }

      setUpdates(updatesWithHospitalNames);
    } catch (error) {
      console.error("Error fetching updates or hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUpdate = async (docId) => {
    const confirmed = window.confirm("Are you sure you want to delete this update?");
    if (!confirmed) {
      return;
    }

    try {
      const updateRef = doc(db, "updates", docId);
      const updateSnapshot = await getDoc(updateRef);

      if (updateSnapshot.exists()) {
        const update = updateSnapshot.data();

        const studentQuery = query(
          collection(db, "students"),
          where("id", "==", update.studentId)
        );
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          const studentDoc = studentSnapshot.docs[0];
          const studentRef = doc(db, "students", studentDoc.id);
          const currentAmount = studentDoc.data().amount || 0;

          const updatedAmount = Math.max(0, currentAmount - parseInt(update.amount));
          await updateDoc(studentRef, { amount: updatedAmount });
        }

        await deleteDoc(updateRef);
        fetchUpdates();
        alert("Update deleted successfully and student's amount updated.");
      } else {
        alert("Update record not found.");
      }
    } catch (error) {
      console.error("Error deleting update:", error);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Updates</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : updates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {updates.map((update) => (
            <div 
              key={update.id} 
              className="bg-white shadow-md rounded-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Student ID: {update.studentId}</p>
                  <h3 className="text-lg font-semibold text-gray-800">{update.hospitalName}</h3>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteUpdate(update.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Reason</p>
                    <p className="text-gray-800 italic">{update.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{update.date}</p>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-2xl font-bold text-green-600">₹{update.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>No updates found.</p>
        </div>
      )}
    </div>
  );
}

export default DisplayUpdates;