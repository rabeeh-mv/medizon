import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

// Shared styles object
const tableStyles = {
  wrapper: "overflow-x-auto rounded-lg border border-gray-200 shadow-sm",
  table: "min-w-full divide-y divide-gray-200",
  thead: "bg-gray-50",
  th: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  td: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
  tr: "hover:bg-gray-50",
  emptyState: "text-center py-8 text-gray-500",
  loading: "text-center py-8 text-gray-500",
};

export function StdDisplay() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsList = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <div className={tableStyles.loading}>Loading students...</div>;

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr>
            <th className={tableStyles.th}>#</th>
            <th className={tableStyles.th}>Student ID</th>
            <th className={tableStyles.th}>Name</th>
            <th className={tableStyles.th}>Amount</th>
            <th className={tableStyles.th}>Payable</th>
            <th className={tableStyles.th}>Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {students.map((student, index) => (
            <tr key={student.docId} className={tableStyles.tr}>
              <td className={tableStyles.td}>{index + 1}</td>
              <td className={tableStyles.td}>{student.id || 'N/A'}</td>
              <td className={tableStyles.td}>{student.name || 'N/A'}</td>
              <td className={tableStyles.td}>{isNaN(student.amount) ? 0 : student.amount}</td>
              <td className={tableStyles.td}>{Math.max(0, student.amount - student.paid)}</td>
              <td className={tableStyles.td}>{isNaN(student.paid) ? 0 : student.paid}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <div className={tableStyles.emptyState}>No students found</div>
      )}
    </div>
  );
}

export function PayDisplay() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <div className={tableStyles.loading}>Loading payments...</div>;

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr>
            <th className={tableStyles.th}>Student ID</th>
            <th className={tableStyles.th}>Amount Paid</th>
            <th className={tableStyles.th}>Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {payments.map((payment) => (
            <tr key={payment.docId} className={tableStyles.tr}>
              <td className={tableStyles.td}>{payment.studentId}</td>
              <td className={tableStyles.td}>${payment.paid}</td>
              <td className={tableStyles.td}>
                {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && (
        <div className={tableStyles.emptyState}>No payments found</div>
      )}
    </div>
  );
}

export function UpDisplay() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      const updatesSnapshot = await getDocs(collection(db, "updates"));
      const updatesWithHospitalNames = await Promise.all(
        updatesSnapshot.docs.map(async (updateDoc) => {
          const updateData = updateDoc.data();
          let hospitalName = "Unknown Hospital";

          if (updateData.hospitalId) {
            const hospitalRef = doc(db, "hospitals", updateData.hospitalId);
            const hospitalSnapshot = await getDoc(hospitalRef);
            if (hospitalSnapshot.exists()) {
              hospitalName = hospitalSnapshot.data().name;
            }
          }

          return {
            id: updateDoc.id,
            ...updateData,
            hospitalName,
          };
        })
      );
      setUpdates(updatesWithHospitalNames);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  if (loading) return <div className={tableStyles.loading}>Loading updates...</div>;

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr>
            <th className={tableStyles.th}>Student ID</th>
            <th className={tableStyles.th}>Hospital</th>
            <th className={tableStyles.th}>Date</th>
            <th className={tableStyles.th}>Reason</th>
            <th className={tableStyles.th}>Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {updates.map((update) => (
            <tr key={update.id} className={tableStyles.tr}>
              <td className={tableStyles.td}>{update.studentId}</td>
              <td className={tableStyles.td}>{update.hospitalName}</td>
              <td className={tableStyles.td}>{update.date}</td>
              <td className={tableStyles.td}>{update.reason}</td>
              <td className={tableStyles.td}>${update.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {updates.length === 0 && (
        <div className={tableStyles.emptyState}>No updates found</div>
      )}
    </div>
  );
}