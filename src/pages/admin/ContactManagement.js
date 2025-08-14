import React, { useState, useEffect } from 'react';
import { Mail, Eye, MessageSquare, Trash2, Search, Filter } from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';
import { SectionLoader } from '../../components/SimpleLoaders';

const ContactManagement = () => {
  const { 
    contacts, 
    loading, 
    error, 
    fetchContacts, 
    updateContactStatus, 
    deleteContact, 
    getContactStats 
  } = useContacts();
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (contactId, newStatus) => {
    const result = await updateContactStatus(contactId, newStatus);
    if (!result.success) {
      alert('Failed to update status: ' + result.error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedContact) return;
    
    const result = await updateContactStatus(selectedContact.id, selectedContact.status, adminNotes);
    if (result.success) {
      setSelectedContact(prev => ({ ...prev, admin_notes: adminNotes }));
      alert('Notes saved successfully!');
    } else {
      alert('Failed to save notes: ' + result.error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }
    
    const result = await deleteContact(contactId);
    if (!result.success) {
      alert('Failed to delete contact: ' + result.error);
    } else {
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = getContactStats();

  if (loading) {
    return <SectionLoader message="Loading contact messages..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Management</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare size={20} className="text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye size={20} className="text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare size={20} className="text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Messages ({filteredContacts.length})
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>No contact messages found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedContact(contact);
                      setAdminNotes(contact.admin_notes || '');
                      if (contact.status === 'unread') {
                        handleStatusUpdate(contact.id, 'read');
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {contact.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                        {contact.subject && (
                          <p className="text-sm text-gray-500 truncate">Subject: {contact.subject}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(contact.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
          </div>
          
          {selectedContact ? (
            <div className="p-4 space-y-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                
                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedContact.phone}</p>
                  </div>
                )}
                
                {selectedContact.subject && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <p className="text-gray-900">{selectedContact.subject}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted</label>
                  <p className="text-gray-900">{formatDate(selectedContact.created_at)}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'unread')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedContact.status === 'unread' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'read')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedContact.status === 'read' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'responded')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedContact.status === 'responded' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Responded
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add internal notes about this contact..."
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Notes
                </button>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete Contact</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;