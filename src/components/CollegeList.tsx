
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MapPin, Phone, Mail, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;

const CollegeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this college?')) return;

    try {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setColleges(colleges.filter(college => college.id !== id));
      toast({
        title: "Success",
        description: "College deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting college:', error);
      toast({
        title: "Error",
        description: "Failed to delete college. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'accepted': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'rejected': 'bg-red-50 text-red-700 border border-red-200',
      'in-discussion': 'bg-blue-50 text-blue-700 border border-blue-200',
      'scheduled': 'bg-purple-50 text-purple-700 border border-purple-200'
    };
    
    const labels = {
      'accepted': 'Accepted',
      'pending': 'Pending',
      'rejected': 'Rejected',
      'in-discussion': 'In Discussion',
      'scheduled': 'Scheduled'
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badges[status as keyof typeof badges] || badges.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || college.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">College Database</h1>
            <p className="text-blue-100 text-lg">Track and manage your college outreach efforts</p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{colleges.filter(c => c.status === 'accepted').length} Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{colleges.filter(c => c.status === 'pending').length} Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>{colleges.filter(c => c.status === 'in-discussion').length} In Discussion</span>
              </div>
            </div>
          </div>
          <button className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Add New College
          </button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search colleges, locations, or contacts..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
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
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredColleges.length}</span> of <span className="font-semibold text-gray-900">{colleges.length}</span> colleges
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Enhanced College Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredColleges.map((college) => (
          <div key={college.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{college.name}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{college.city}, {college.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {college.college_type}
                    </span>
                    {getStatusBadge(college.status || 'pending')}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <span className="font-semibold text-gray-700 w-20 flex-shrink-0">Contact:</span>
                  <span className="text-gray-600">{college.contact_person || 'Not specified'}</span>
                </div>
                {college.contact_phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{college.contact_phone}</span>
                  </div>
                )}
                {college.contact_email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{college.contact_email}</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-6 text-sm border-t border-gray-100 pt-4">
                {college.last_contact_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Contact:</span>
                    <span className="text-gray-900 font-medium">{new Date(college.last_contact_date).toLocaleDateString()}</span>
                  </div>
                )}
                {college.next_followup_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Follow-up:</span>
                    <span className="text-blue-600 font-semibold">{new Date(college.next_followup_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(college.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredColleges.length === 0 && !loading && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No colleges found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' 
              ? "Try adjusting your search criteria or filters to find what you're looking for."
              : "Get started by adding your first college to the database."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(searchTerm || filterStatus !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Add First College
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeList;
