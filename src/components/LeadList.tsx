import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import axios from 'axios';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({ name: '', company: '', phone: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const addLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leads', newLead, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewLead({ name: '', company: '', phone: '' });
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>
      <form onSubmit={addLead} className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-2">
          <UserPlus className="mr-2" />
          <h3 className="font-semibold">Add New Lead</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={newLead.company}
            onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Lead
        </button>
      </form>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-t">
              <td className="p-2">{lead.name}</td>
              <td className="p-2">{lead.company}</td>
              <td className="p-2">{lead.phone}</td>
              <td className="p-2">{lead.status}</td>
              <td className="p-2">{lead.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadList;