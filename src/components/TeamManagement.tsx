
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

type TeamMember = Tables<'team_members'>;

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'field_executive' as 'field_executive' | 'team_lead' | 'manager' | 'admin',
    department: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([newMember])
        .select()
        .single();

      if (error) throw error;

      setMembers([data, ...members]);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: 'field_executive',
        department: ''
      });
      setShowCreateForm(false);

      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const updateMember = async () => {
    if (!editingMember) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({
          name: editingMember.name,
          email: editingMember.email,
          phone: editingMember.phone,
          role: editingMember.role,
          department: editingMember.department,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMember.id)
        .select()
        .single();

      if (error) throw error;

      setMembers(members.map(member => 
        member.id === editingMember.id ? data : member
      ));
      setEditingMember(null);

      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(members.filter(member => member.id !== memberId));

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'team_lead': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'field_executive': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesRole;
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Team Management</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Member</span>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold">{members.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Active</p>
                <p className="text-lg font-bold text-green-600">
                  {members.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Managers</p>
                <p className="text-lg font-bold text-purple-600">
                  {members.filter(m => m.role === 'manager').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Executives</p>
                <p className="text-lg font-bold text-blue-600">
                  {members.filter(m => m.role === 'field_executive').length}
                </p>
              </div>
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
              placeholder="Search team members..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="team_lead">Team Lead</option>
            <option value="field_executive">Field Executive</option>
          </select>
        </div>
      </Card>

      {/* Create/Edit Form */}
      {(showCreateForm || editingMember) && (
        <Card className="p-4">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingMember(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <Input
              placeholder="Full Name"
              value={editingMember ? editingMember.name : newMember.name}
              onChange={(e) => editingMember 
                ? setEditingMember({...editingMember, name: e.target.value})
                : setNewMember({...newMember, name: e.target.value})
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={editingMember ? editingMember.email : newMember.email}
              onChange={(e) => editingMember 
                ? setEditingMember({...editingMember, email: e.target.value})
                : setNewMember({...newMember, email: e.target.value})
              }
            />
            <Input
              placeholder="Phone"
              value={editingMember ? editingMember.phone || '' : newMember.phone}
              onChange={(e) => editingMember 
                ? setEditingMember({...editingMember, phone: e.target.value})
                : setNewMember({...newMember, phone: e.target.value})
              }
            />
            <Input
              placeholder="Department"
              value={editingMember ? editingMember.department || '' : newMember.department}
              onChange={(e) => editingMember 
                ? setEditingMember({...editingMember, department: e.target.value})
                : setNewMember({...newMember, department: e.target.value})
              }
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editingMember ? editingMember.role : newMember.role}
              onChange={(e) => editingMember 
                ? setEditingMember({...editingMember, role: e.target.value as any})
                : setNewMember({...newMember, role: e.target.value as any})
              }
            >
              <option value="field_executive">Field Executive</option>
              <option value="team_lead">Team Lead</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-3">
              <Button 
                onClick={editingMember ? updateMember : createMember} 
                className="flex-1"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingMember(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="space-y-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(member.role || 'field_executive')}`}>
                        {member.role?.replace('_', ' ')}
                      </span>
                      {member.department && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                          {member.department}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMember(member)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMember(member.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterRole !== 'all'
                ? "Try adjusting your search or filter criteria."
                : "Add your first team member to get started."
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
