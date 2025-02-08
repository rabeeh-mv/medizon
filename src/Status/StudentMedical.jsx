import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { AlertCircle } from 'lucide-react';

const colors = {
  primary: '#1A3C40',
  secondary: '#417D7A',
  accent: '#9DC3C1',
  background: '#F5F7F8',
  text: '#2D2D2D',
  error: '#DC2626',
  success: '#059669'
};

const CustomAlert = ({ message, type }) => {
  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  
  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center gap-2`}>
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
};

function StudentMedical() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [condition, setCondition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const calculateDays = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchMedicalRecords = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "medical_records"));
      const records = [];
      
      for (const doc of querySnapshot.docs) {
        const record = doc.data();
        const studentDoc = await getStudentById(record.studentId);
        const status = record.endDate ? 'completed' : 'active';
        records.push({
          id: doc.id,
          ...record,
          studentName: studentDoc?.name || 'Unknown Student',
          daysSince: calculateDays(record.startDate, record.endDate),
          status
        });
      }
      
      setMedicalRecords(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      showAlert("Error fetching medical records", "error");
    }
  };

  const getStudentById = async (id) => {
    try {
      const studentQuery = query(
        collection(db, "students"), 
        where("id", "==", parseInt(id))
      );
      const querySnapshot = await getDocs(studentQuery);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleStudentIdChange = async (e) => {
    const id = e.target.value;
    setStudentId(id);
    
    if (id) {
      const student = await getStudentById(id);
      if (student) {
        setStudentName(student.name);
      } else {
        setStudentName('');
        showAlert("Student not found", "error");
      }
    }
  };

  const addMedicalRecord = async (e) => {
    e.preventDefault();
    
    if (!studentId || !condition || !startDate) {
      showAlert("Please fill in all required fields", "error");
      return;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      showAlert("End date cannot be before start date", "error");
      return;
    }

    try {
      const student = await getStudentById(studentId);
      if (!student) {
        showAlert("Student not found", "error");
        return;
      }

      await addDoc(collection(db, "medical_records"), {
        studentId: parseInt(studentId),
        condition,
        startDate,
        endDate: endDate || null,
        createdAt: serverTimestamp(),
      });

      showAlert("Medical record added successfully", "success");
      setStudentId('');
      setCondition('');
      setStartDate('');
      setEndDate('');
      setStudentName('');
      fetchMedicalRecords();
    } catch (error) {
      console.error("Error adding medical record:", error);
      showAlert("Error adding medical record", "error");
    }
  };

  const updateMedicalRecord = async (recordId, newEndDate) => {
    try {
      const recordRef = doc(db, "medical_records", recordId);
      await updateDoc(recordRef, {
        endDate: newEndDate
      });
      showAlert("Medical record updated successfully", "success");
      fetchMedicalRecords();
    } catch (error) {
      console.error("Error updating medical record:", error);
      showAlert("Error updating medical record", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {alert.show && (
          <CustomAlert message={alert.message} type={alert.type} />
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>
            Add Medical Record
          </h2>

          <form onSubmit={addMedicalRecord} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Student ID*
                </label>
                <input
                  type="number"
                  value={studentId}
                  onChange={handleStudentIdChange}
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: colors.accent }}
                  placeholder="Enter Student ID"
                />
                {studentName && (
                  <p className="mt-1 text-sm text-gray-600">Student: {studentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Medical Condition*
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: colors.accent }}
                  placeholder="Enter Medical Condition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Start Date*
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: colors.accent }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:outline-none"
                  style={{ borderColor: colors.accent }}
                  min={startDate}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: colors.primary }}
            >
              Add Medical Record
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.primary }}>
            Medical Records
          </h2>

          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b" style={{ color: colors.text }}>
                <th className="text-left p-3">Student ID</th>
                <th className="text-left p-3">Student Name</th>
                <th className="text-left p-3">Condition</th>
                <th className="text-left p-3">Start Date</th>
                <th className="text-left p-3">End Date</th>
                <th className="text-left p-3">Days Count</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.studentId}</td>
                  <td className="p-3">{record.studentName}</td>
                  <td className="p-3">{record.condition}</td>
                  <td className="p-3">{record.startDate}</td>
                  <td className="p-3">{record.endDate || '-'}</td>
                  <td className="p-3">{record.daysSince} days</td>
                  <td className="p-3">
                    <span 
                      className={`px-2 py-1 rounded-full text-sm ${
                        record.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {record.status === 'active' && (
                      <button
                        onClick={() => updateMedicalRecord(record.id, new Date().toISOString().split('T')[0])}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        End Condition
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentMedical;