import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Alert from "../operations/Alert";
import { Trash2, Edit2 } from "lucide-react";
function DisplayStd({ Addstd, updateStd, setStudentToEdit, colors }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertinfo, setAlertinfo] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsList = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteStudent = (docId) => {
    setShowConfirmDelete(true);
    setStudentToDelete(docId);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "students", studentToDelete));
      setAlertinfo("Student deleted successfully!");
      setShowConfirmDelete(false);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [Addstd, updateStd]);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const name = student.name?.toLowerCase() || '';
    const id = student.id?.toString() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || id.includes(searchQuery);
  });

  return (
    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: 'white' }}>
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0" style={{ color: colors.primary }}>
          Students List
        </h2>
        
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 p-3 rounded-lg border focus:outline-none focus:ring-2"
          style={{
            borderColor: colors.accent,
            focusBorderColor: colors.primary,
            focusRingColor: colors.accent
          }}
        />
      </div>

      {/* Table */}
      {filteredStudents.length === 0 ? (
        <p className="text-center py-6" style={{ color: colors.lightText }}>
          No students found matching your search criteria.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: colors.accent }}>
          <table className="w-full">
            <thead style={{ backgroundColor: colors.background }}>
              <tr>
                {['#', 'Student ID', 'Name', 'Amount', 'Payable', 'Paid', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.docId}
                  className="hover:bg-gray-50 transition-colors border-t"
                  style={{ borderColor: colors.accent }}
                >
                  <td className="px-4 py-3" style={{ color: colors.lightText }}>{index + 1}</td>
                  <td className="px-4 py-3">{student.id || 0}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: colors.text }}>{student.name || "N/A"}</td>
                  <td className="px-4 py-3">{isNaN(student.amount) ? 0 : student.amount}</td>
                  <td className="px-4 py-3">{Math.max(0, student.amount - student.paid - 200) || 0}</td>
                  <td className="px-4 py-3">{isNaN(student.paid) ? 0 : student.paid}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="px-3 py-1 rounded-md transition-colors hover:bg-opacity-90"
                      style={{ backgroundColor: colors.accent, color: colors.primary }}
                      onClick={() => setStudentToEdit(student)}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="px-3 py-1 rounded-md transition-colors hover:bg-opacity-90"
                      style={{ backgroundColor: colors.background, color: colors.text }}
                      onClick={() => handleDeleteStudent(student.docId)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {showConfirmDelete && (
        <Alert
          alert="Are you sure you want to delete this student?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          colors={colors}
        />
        
      )}
    </div>
  );
}

export default DisplayStd;