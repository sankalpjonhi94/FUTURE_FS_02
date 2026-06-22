import React from 'react';
import { FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const statusBadge = (status) => {
  const map = {
    new: 'badge-new',
    contacted: 'badge-contacted',
    qualified: 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    won: 'badge-won',
    lost: 'badge-lost',
    proposal: 'bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
    negotiation: 'bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full',
  };
  return map[status] || 'badge-new';
};

const priorityBadge = (priority) => {
  const map = {
    high: 'text-red-600 font-semibold',
    medium: 'text-yellow-600 font-semibold',
    low: 'text-green-600 font-semibold',
  };
  return map[priority] || '';
};

const LeadTable = ({ leads, onEdit, onDelete, onConvert, loading }) => {
  if (loading) return <div className="text-center py-10 text-gray-400">Loading leads...</div>;
  if (!leads?.length) return <div className="text-center py-10 text-gray-400">No leads found.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Value</th>
            <th className="px-4 py-3 text-left">Assigned To</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => (
            <tr key={lead._id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{lead.company || '—'}</td>
              <td className="px-4 py-3">
                <span className={statusBadge(lead.status)}>{lead.status}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs capitalize ${priorityBadge(lead.priority)}`}>
                  {lead.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">₹{lead.value?.toLocaleString() || 0}</td>
              <td className="px-4 py-3 text-gray-600">{lead.assignedTo?.name || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  {!lead.convertedToCustomer && (
                    <button
                      onClick={() => onConvert(lead._id)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                      title="Convert to Customer"
                    >
                      <FiRefreshCw size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
