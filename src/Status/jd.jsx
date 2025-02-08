import React from 'react';
import { ActivitySquare, Calendar, Clock, User } from 'lucide-react';

const MedicalRecordCard = ({ data }) => {
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateDays = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((record) => (
          <div 
            key={record.id} 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header with Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ActivitySquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg text-gray-900">
                  {record.condition}
                </h3>
              </div>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  getStatusColor(record.status)
                }`}
              >
                {record.status}
              </span>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <User className="h-4 w-4" />
              <div>
                <span className="font-medium text-gray-900">
                  {record.studentName}
                </span>
                <span className="text-sm ml-2 text-gray-500">
                  ID: {record.studentId}
                </span>
              </div>
            </div>

            {/* Dates Section */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Start: {record.startDate}</span>
              </div>
              {record.endDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>End: {record.endDate}</span>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">
                Duration: {calculateDays(record.startDate, record.endDate)} days
              </span>
            </div>

            {/* Action Button - Only show for active records */}
            {record.status === 'active' && (
              <button
                onClick={() => record.onEnd?.(record.id)}
                className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                End Condition
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage with sample data
const ExampleUsage = () => {
  const sampleData = [
    {
      id: 1,
      studentId: "1001",
      studentName: "John Doe",
      condition: "Fever",
      startDate: "2024-02-01",
      endDate: null,
      status: "active",
      onEnd: (id) => console.log(`Ending condition for record ${id}`)
    },
    {
      id: 2,
      studentId: "1002",
      studentName: "Jane Smith",
      condition: "Sprained Ankle",
      startDate: "2024-01-15",
      endDate: "2024-02-05",
      status: "completed"
    }
  ];

  return <MedicalRecordCard data={sampleData} />;
};

export default ExampleUsage;