
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Phone, Mail, User, FileText, Plus, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type College = Tables<'colleges'>;
type InteractionLog = Tables<'interaction_logs'>;

interface CollegeDetailsModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const CollegeDetailsModal = ({ college, isOpen, onClose, onUpdate }: CollegeDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [interactions, setInteractions] = useState<InteractionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    executive_name: '',
    contact_method: 'Call',
    notes: '',
    interaction_date: new Date().toISOString().split('T')[0]
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: college?.status || 'pending',
    last_contact_date: college?.last_contact_date || '',
    next_followup_date: college?.next_followup_date || '',
    rejection_reason: college?.rejection_reason || '',
    status_notes: college?.status_notes || ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (college && isOpen) {
      fetchInteractions();
      setStatusUpdate({
        status: college.status || 'pending',
        last_contact_date: college.last_contact_date || '',
        next_followup_date: college.next_followup_date || '',
        rejection_reason: college.rejection_reason || '',
        status_notes: college.status_notes || ''
      });
    }
  }, [college, isOpen]);

  const fetchInteractions = async () => {
    if (!college) return;
    
    try {
      const { data, error } = await supabase
        .from('interaction_logs')
        .select('*')
        .eq('college_id', college.id)
        .order('interaction_date', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const addInteraction = async () => {
    if (!college || !newInteraction.notes.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the notes field",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('interaction_logs')
        .insert([{
          college_id: college.id,
          ...newInteraction
        }]);

      if (error) throw error;

      setNewInteraction({
        executive_name: '',
        contact_method: 'Call',
        notes: '',
        interaction_date: new Date().toISOString().split('T')[0]
      });

      await fetchInteractions();
      toast({
        title: "Success",
        description: "Interaction logged successfully",
      });
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast({
        title: "Error",
        description: "Failed to log interaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCollegeStatus = async () => {
    if (!college) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('colleges')
        .update(statusUpdate)
        .eq('id', college.id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Success",
        description: "College status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'accepted': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
      'in-discussion': 'bg-blue-100 text-blue-800',
      'scheduled': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Visit': return <User className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!college) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{college.name}</span>
            <Badge className={getStatusColor(college.status || 'pending')}>
              {college.status || 'pending'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            College Details
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 font-medium ${activeTab === 'status' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Status Tracking
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-4 py-2 font-medium ${activeTab === 'interactions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Interaction Log ({interactions.length})
          </button>
        </div>

        {/* College Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{college.address}</p>
                  <p>{college.city}, {college.state}</p>
                  {college.pin_code && <p>PIN: {college.pin_code}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {college.contact_person && (
                    <p><span className="font-medium">Contact Person:</span> {college.contact_person}</p>
                  )}
                  {college.contact_email && (
                    <p><span className="font-medium">Email:</span> {college.contact_email}</p>
                  )}
                  {college.contact_phone && (
                    <p><span className="font-medium">Phone:</span> {college.contact_phone}</p>
                  )}
                  {college.college_type && (
                    <p><span className="font-medium">Type:</span> {college.college_type}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {college.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{college.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Status Tracking Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Outreach Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={statusUpdate.status} onValueChange={(value) => setStatusUpdate({...statusUpdate, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="in-discussion">In Discussion</SelectItem>
                        <SelectItem value="scheduled">Scheduled Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Last Contact Date</label>
                    <Input
                      type="date"
                      value={statusUpdate.last_contact_date}
                      onChange={(e) => setStatusUpdate({...statusUpdate, last_contact_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Next Follow-up Date</label>
                    <Input
                      type="date"
                      value={statusUpdate.next_followup_date}
                      onChange={(e) => setStatusUpdate({...statusUpdate, next_followup_date: e.target.value})}
                    />
                  </div>
                </div>

                {statusUpdate.status === 'rejected' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Rejection</label>
                    <Textarea
                      value={statusUpdate.rejection_reason}
                      onChange={(e) => setStatusUpdate({...statusUpdate, rejection_reason: e.target.value})}
                      placeholder="Please provide the reason for rejection..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Status Notes</label>
                  <Textarea
                    value={statusUpdate.status_notes}
                    onChange={(e) => setStatusUpdate({...statusUpdate, status_notes: e.target.value})}
                    placeholder="Add any additional notes about the current status..."
                  />
                </div>

                <Button onClick={updateCollegeStatus} disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Status'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interactions Tab */}
        {activeTab === 'interactions' && (
          <div className="space-y-4">
            {/* Add New Interaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Log New Interaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Executive Name</label>
                    <Input
                      value={newInteraction.executive_name}
                      onChange={(e) => setNewInteraction({...newInteraction, executive_name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Method</label>
                    <Select value={newInteraction.contact_method} onValueChange={(value) => setNewInteraction({...newInteraction, contact_method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Visit">Visit</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      value={newInteraction.interaction_date}
                      onChange={(e) => setNewInteraction({...newInteraction, interaction_date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes *</label>
                  <Textarea
                    value={newInteraction.notes}
                    onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                    placeholder="Describe the interaction details, outcomes, next steps..."
                    rows={3}
                  />
                </div>

                <Button onClick={addInteraction} disabled={loading} className="w-full">
                  {loading ? 'Logging...' : 'Log Interaction'}
                </Button>
              </CardContent>
            </Card>

            {/* Interaction History */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Interaction History</h3>
              {interactions.length > 0 ? (
                interactions.map((interaction) => (
                  <Card key={interaction.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getContactMethodIcon(interaction.contact_method || 'Call')}
                          <span className="font-medium">{interaction.contact_method}</span>
                          <Badge variant="outline">{interaction.executive_name}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(interaction.interaction_date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700">{interaction.notes}</p>
                      {interaction.file_url && (
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            View Attachment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No interactions logged yet</p>
                    <p className="text-sm">Add your first interaction above</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CollegeDetailsModal;
