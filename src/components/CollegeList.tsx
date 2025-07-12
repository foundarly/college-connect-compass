
import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, Mail, Eye, Edit, Trash2, Building2, Filter, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CollegeDetailsModal from './CollegeDetailsModal';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;

const CollegeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    city: '',
    state: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    college_type: '',
    address: '',
    pin_code: '',
    description: ''
  });
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

  const createCollege = async () => {
    if (!newCollege.name.trim()) {
      toast({
        title: "Error",
        description: "College name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('colleges')
        .insert([{
          ...newCollege,
          created_by: null
        }])
        .select()
        .single();

      if (error) throw error;

      setColleges([data, ...colleges]);
      setNewCollege({
        name: '',
        city: '',
        state: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        college_type: '',
        address: '',
        pin_code: '',
        description: ''
      });
      setShowCreateForm(false);

      toast({
        title: "Success",
        description: "College added successfully",
      });
    } catch (error) {
      console.error('Error creating college:', error);
      toast({
        title: "Error",
        description: "Failed to add college",
        variant: "destructive",
      });
    }
  };

  const deleteCollege = async (id: string) => {
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

  const openDetailsModal = (college: College) => {
    setSelectedCollege(college);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'in-discussion': 'bg-blue-100 text-blue-800 border-blue-200',
      'scheduled': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || statusColors.pending} border`}>
        {status?.replace('-', ' ') || 'pending'}
      </Badge>
    );
  };

  const getUpcomingFollowups = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return colleges.filter(college => {
      if (!college.next_followup_date) return false;
      const followupDate = new Date(college.next_followup_date);
      return followupDate >= today && followupDate <= nextWeek;
    });
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || college.status === filterStatus;
    const matchesType = filterType === 'all' || college.college_type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusStats = {
    total: colleges.length,
    accepted: colleges.filter(c => c.status === 'accepted').length,
    pending: colleges.filter(c => c.status === 'pending').length,
    inDiscussion: colleges.filter(c => c.status === 'in-discussion').length,
    scheduled: colleges.filter(c => c.status === 'scheduled').length,
    rejected: colleges.filter(c => c.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">College Management</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add College</span>
          </Button>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-gray-900">{statusStats.total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-green-600">{statusStats.accepted}</p>
              <p className="text-xs text-gray-600">Accepted</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-yellow-600">{statusStats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-blue-600">{statusStats.inDiscussion}</p>
              <p className="text-xs text-gray-600">In Discussion</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-purple-600">{statusStats.scheduled}</p>
              <p className="text-xs text-gray-600">Scheduled</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-red-600">{statusStats.rejected}</p>
              <p className="text-xs text-gray-600">Rejected</p>
            </div>
          </Card>
        </div>

        {/* Upcoming Follow-ups Alert */}
        {getUpcomingFollowups().length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-800">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {getUpcomingFollowups().length} college(s) need follow-up this week
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search colleges by name, city, or contact person..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in-discussion">In Discussion</SelectItem>
                  <SelectItem value="scheduled">Scheduled Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Filter by Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Degree">Degree</SelectItem>
                  <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                }}
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Create College Form */}
      {showCreateForm && (
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Add New College</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">College Name *</label>
                <Input
                  placeholder="Enter college name"
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({...newCollege, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">College Type</label>
                <Select value={newCollege.college_type} onValueChange={(value) => setNewCollege({...newCollege, college_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Degree">Degree</SelectItem>
                    <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                placeholder="Enter full address"
                value={newCollege.address}
                onChange={(e) => setNewCollege({...newCollege, address: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  placeholder="City"
                  value={newCollege.city}
                  onChange={(e) => setNewCollege({...newCollege, city: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Input
                  placeholder="State"
                  value={newCollege.state}
                  onChange={(e) => setNewCollege({...newCollege, state: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PIN Code</label>
                <Input
                  placeholder="PIN Code"
                  value={newCollege.pin_code}
                  onChange={(e) => setNewCollege({...newCollege, pin_code: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <Input
                  placeholder="Contact person name"
                  value={newCollege.contact_person}
                  onChange={(e) => setNewCollege({...newCollege, contact_person: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={newCollege.contact_phone}
                  onChange={(e) => setNewCollege({...newCollege, contact_phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                placeholder="Email address"
                type="email"
                value={newCollege.contact_email}
                onChange={(e) => setNewCollege({...newCollege, contact_email: e.target.value})}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={createCollege} className="flex-1">
                Add College
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Colleges List */}
      <div className="space-y-4">
        {filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <Card key={college.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{college.name}</h3>
                      {getStatusBadge(college.status || 'pending')}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{college.city}, {college.state}</span>
                      </div>
                      {college.college_type && (
                        <Badge variant="outline" className="text-xs">
                          {college.college_type}
                        </Badge>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                      {college.contact_person && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{college.contact_person}</span>
                        </div>
                      )}
                      {college.contact_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{college.contact_phone}</span>
                        </div>
                      )}
                      {college.contact_email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{college.contact_email}</span>
                        </div>
                      )}
                    </div>

                    {/* Follow-up dates */}
                    {(college.last_contact_date || college.next_followup_date) && (
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                        {college.last_contact_date && (
                          <span>Last contact: {new Date(college.last_contact_date).toLocaleDateString()}</span>
                        )}
                        {college.next_followup_date && (
                          <span className={new Date(college.next_followup_date) <= new Date(Date.now() + 7*24*60*60*1000) ? 'text-orange-600 font-medium' : ''}>
                            Next follow-up: {new Date(college.next_followup_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="flex-1"
                    onClick={() => openDetailsModal(college)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteCollege(college.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? "Try adjusting your search criteria."
                : "Add your first college to get started."
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First College
            </Button>
          </Card>
        )}
      </div>

      {/* College Details Modal */}
      <CollegeDetailsModal
        college={selectedCollege}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCollege(null);
        }}
        onUpdate={fetchColleges}
      />
    </div>
  );
};

export default CollegeList;
