
import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, Mail, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;

const CollegeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    city: '',
    state: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    college_type: '',
    address: ''
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
          created_by: null // In a real app, this would be the authenticated user's ID
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
        address: ''
      });
      setShowCreateForm(false);

      toast({
        title: "Success",
        description: "College created successfully",
      });
    } catch (error) {
      console.error('Error creating college:', error);
      toast({
        title: "Error",
        description: "Failed to create college",
        variant: "destructive",
      });
    }
  };

  const deleteCollege = async (id: string) => {
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
    const statusColors = {
      'accepted': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'in-discussion': 'bg-blue-100 text-blue-800 border-blue-200',
      'scheduled': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status as keyof typeof statusColors] || statusColors.pending}`}>
        {status}
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Colleges</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add College</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{colleges.filter(c => c.status === 'accepted').length}</p>
              <p className="text-xs text-gray-600">Accepted</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{colleges.filter(c => c.status === 'pending').length}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{colleges.filter(c => c.status === 'in-discussion').length}</p>
              <p className="text-xs text-gray-600">In Discussion</p>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{colleges.length}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search colleges..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
            <Input
              placeholder="College name *"
              value={newCollege.name}
              onChange={(e) => setNewCollege({...newCollege, name: e.target.value})}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="City"
                value={newCollege.city}
                onChange={(e) => setNewCollege({...newCollege, city: e.target.value})}
              />
              <Input
                placeholder="State"
                value={newCollege.state}
                onChange={(e) => setNewCollege({...newCollege, state: e.target.value})}
              />
            </div>
            <Input
              placeholder="Address"
              value={newCollege.address}
              onChange={(e) => setNewCollege({...newCollege, address: e.target.value})}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Contact person"
                value={newCollege.contact_person}
                onChange={(e) => setNewCollege({...newCollege, contact_person: e.target.value})}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newCollege.college_type}
                onChange={(e) => setNewCollege({...newCollege, college_type: e.target.value})}
              >
                <option value="">Select Type</option>
                <option value="Engineering">Engineering</option>
                <option value="Degree">Degree</option>
                <option value="Polytechnic">Polytechnic</option>
                <option value="Medical">Medical</option>
                <option value="Technical">Technical</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Email"
                type="email"
                value={newCollege.contact_email}
                onChange={(e) => setNewCollege({...newCollege, contact_email: e.target.value})}
              />
              <Input
                placeholder="Phone"
                type="tel"
                value={newCollege.contact_phone}
                onChange={(e) => setNewCollege({...newCollege, contact_phone: e.target.value})}
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
            <Card key={college.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{college.city}, {college.state}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {college.college_type && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {college.college_type}
                        </span>
                      )}
                      {getStatusBadge(college.status || 'pending')}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-sm text-gray-600">
                  {college.contact_person && (
                    <div>Contact: {college.contact_person}</div>
                  )}
                  {college.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {college.contact_phone}
                    </div>
                  )}
                  {college.contact_email && (
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {college.contact_email}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteCollege(college.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
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
              {searchTerm || filterStatus !== 'all' 
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
    </div>
  );
};

export default CollegeList;
