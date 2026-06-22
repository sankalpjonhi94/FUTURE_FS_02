import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import Loader from '../components/Loader';
import { setLeads, addLead, updateLead, removeLead } from '../redux/leadSlice';
import {
  getLeadsApi, createLeadApi, updateLeadApi, deleteLeadApi, convertLeadApi,
} from '../api/leadApi';
import { FiPlus, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Leads = () => {
  const dispatch = useDispatch();
  const { leads, total, loading } = useSelector((state) => state.leads);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchLeads = async () => {
    try {
      const { data } = await getLeadsApi({ search, status: statusFilter, page, limit: 10 });
      dispatch(setLeads(data));
      setPages(data.pages);
    } catch {
      toast.error('Failed to fetch leads');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, page]);

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await createLeadApi(form);
      dispatch(addLead(data));
      setShowForm(false);
      toast.success('Lead created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating lead');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await updateLeadApi(editLead._id, form);
      dispatch(updateLead(data));
      setEditLead(null);
      setShowForm(false);
      toast.success('Lead updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating lead');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLeadApi(id);
      dispatch(removeLead(id));
      toast.success('Lead deleted');
    } catch {
      toast.error('Error deleting lead');
    }
  };

  const handleConvert = async (id) => {
    if (!window.confirm('Convert this lead to customer?')) return;
    try {
      await convertLeadApi(id);
      toast.success('Lead converted to customer!');
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  const handleEdit = (lead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditLead(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Leads" />
        <main className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search leads..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {['new','contacted','qualified','proposal','negotiation','won','lost'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={16} /> Add Lead
            </button>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-500 mb-3">Total: <strong>{total}</strong> leads</p>

          {/* Table */}
          {loading ? (
            <Loader />
          ) : (
            <LeadTable
              leads={leads}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onConvert={handleConvert}
              loading={loading}
            />
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {showForm && (
        <LeadForm
          lead={editLead}
          onSubmit={editLead ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default Leads;
