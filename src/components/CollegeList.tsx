
import React, { useState } from 'react';
import { Search, Filter, Plus, MapPin, Phone, Mail, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const CollegeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const colleges = [
    {
      id: 1,
      name: 'MIT Engineering College',
      location: 'Mumbai, Maharashtra',
      type: 'Engineering',
      contactPerson: 'Dr. Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@mit.edu',
      status: 'accepted',
      lastContact: '2024-03-10',
      nextFollowup: '2024-03-15'
    },
    {
      id: 2,
      name: 'Delhi Technical University',
      location: 'Delhi, NCR',
      type: 'Technical',
      contactPerson: 'Prof. Priya Sharma',
      phone: '+91 98765 43211',
      email: 'priya@dtu.ac.in',
      status: 'pending',
      lastContact: '2024-03-08',
      nextFollowup: '2024-03-12'
    },
    {
      id: 3,
      name: 'Bangalore Polytechnic',
      location: 'Bangalore, Karnataka',
      type: 'Polytechnic',
      contactPerson: 'Mr. Suresh Reddy',
      phone: '+91 98765 43212',
      email: 'suresh@bpoly.edu',
      status: 'rejected',
      lastContact: '2024-03-05',
      nextFollowup: null
    },
    {
      id: 4,
      name: 'Chennai Degree College',
      location: 'Chennai, Tamil Nadu',
      type: 'Degree',
      contactPerson: 'Ms. Lakshmi Iyer',
      phone: '+91 98765 43213',
      email: 'lakshmi@cdc.edu',
      status: 'in-discussion',
      lastContact: '2024-03-09',
      nextFollowup: '2024-03-14'
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'accepted': 'bg-green-100 text-green-800 border border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border border-red-200',
      'in-discussion': 'bg-blue-100 text-blue-800 border border-blue-200',
      'scheduled': 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    
    const labels = {
      'accepted': 'Accepted',
      'pending': 'Pending',
      'rejected': 'Rejected',
      'in-discussion': 'In Discussion',
      'scheduled': 'Scheduled'
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges] || badges.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || college.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colleges</h1>
          <p className="text-gray-600 mt-1">Manage your college outreach database</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Add College
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search colleges, locations, or contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="in-discussion">In Discussion</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredColleges.length} of {colleges.length} colleges
      </div>

      {/* College Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <div key={college.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{college.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {college.location}
                  </div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {college.type}
                  </span>
                </div>
                {getStatusBadge(college.status)}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900 w-20">Contact:</span>
                  {college.contactPerson}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {college.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {college.email}
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Contact:</span>
                  <span className="text-gray-900">{college.lastContact}</span>
                </div>
                {college.nextFollowup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Follow-up:</span>
                    <span className="text-blue-600 font-medium">{college.nextFollowup}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredColleges.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CollegeList;
