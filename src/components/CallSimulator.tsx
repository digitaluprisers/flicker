import React, { useState } from 'react';
import { Phone, Mic, MicOff } from 'lucide-react';
import axios from 'axios';

const CallSimulator = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');
  const [leads, setLeads] = useState([]);

  React.useEffect(() => {
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

  const startCall = async () => {
    if (!selectedLead) {
      alert('Please select a lead before starting the call.');
      return;
    }
    try {
      const response = await axios.post('/api/calls/initiate', { leadId: selectedLead }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsCallActive(true);
      setTranscript(`Call initiated. SID: ${response.data.callSid}`);
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setTranscript('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Call Simulator</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="leadSelect" className="block text-sm font-medium text-gray-700">Select Lead</label>
          <select
            id="leadSelect"
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a lead</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>{lead.name} - {lead.company}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={isCallActive ? endCall : startCall}
            className={`flex items-center px-4 py-2 rounded ${
              isCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            <Phone className="mr-2" />
            {isCallActive ? 'End Call' : 'Start Call'}
          </button>
          {isCallActive && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center px-4 py-2 rounded ${
                isMuted ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isMuted ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          )}
        </div>
        {isCallActive && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{transcript}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallSimulator;