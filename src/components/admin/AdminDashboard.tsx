import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Activity,
  Receipt,
  Store,
  Bike,
  HelpCircle,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  RefreshCw,
  Sliders,
  DollarSign,
  X,
} from 'lucide-react';
import { Order, SupportTicket } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    restaurants,
    tickets,
    riderState,
    updateOrderTimeline,
    updateTicketStatus,
    showToast,
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    'overview' | 'orders' | 'partners' | 'riders' | 'tickets' | 'settings'
  >('overview');
  const [adminRole, setAdminRole] = useState<'super_admin' | 'ops_manager' | 'support_agent' | 'finance'>('ops_manager');

  // Search filter
  const [orderSearch, setOrderSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  // Reassign Rider modal
  const [reassignModalOrder, setReassignModalOrder] = useState<Order | null>(null);
  const [selectedNewRiderName, setSelectedNewRiderName] = useState('Tunde Adeleke (Lekki Zone)');
  const [reassignReason, setReassignReason] = useState('Previous rider experienced flat tire');

  // Partner verification mock state
  const [partnerApps, setPartnerApps] = useState([
    { id: 'pa-1', name: 'Bungalow Grill & Seafood', area: 'Victoria Island', cac: 'RC-992144', status: 'approved' },
    { id: 'pa-2', name: 'Ile Eros Gourmet Pastries', area: 'Lekki Phase 1', cac: 'RC-110294', status: 'approved' },
    { id: 'pa-3', name: 'Mama Cass Bukka Express', area: 'Ikeja GRA', cac: 'RC-482910', status: 'pending_review' },
  ]);

  // Support Ticket resolution
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Settings
  const [platformFee, setPlatformFee] = useState(250);
  const [commissionRate, setCommissionRate] = useState(15);
  const [dispatchTimeout, setDispatchTimeout] = useState(120);

  // Filtered live orders
  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.restaurantName.toLowerCase().includes(q) ||
      o.serviceArea.toLowerCase().includes(q)
    );
  });

  const activeOrdersCount = orders.filter((o) => o.timelineState !== 'completed' && o.timelineState !== 'cancelled').length;
  const overdueAlertsCount = orders.filter((o) => o.timelineState === 'preparing').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open' || t.status === 'investigating').length;

  const handleExecuteReassign = () => {
    if (!reassignModalOrder) return;
    updateOrderTimeline(reassignModalOrder.id, 'rider_assigned', {
      riderName: selectedNewRiderName.split(' ')[0] + ' ' + selectedNewRiderName.split(' ')[1],
    });
    setReassignModalOrder(null);
    showToast(`Order #${reassignModalOrder.orderNumber} reassigned to ${selectedNewRiderName}. Reason logged in audit.`);
  };

  const handleResolveTicket = (ticketId: string) => {
    updateTicketStatus(ticketId, 'resolved', resolutionNote || 'Issue investigated & closed with resolution');
    setResolvingTicketId(null);
    setResolutionNote('');
  };

  const handleApprovePartner = (id: string) => {
    setPartnerApps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
    showToast('Kitchen partner approved for public marketplace listing');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Admin Top Operations Bar */}
      <div className="p-5 rounded-3xl bg-[#242124] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#CBB477]" />
            <h1 className="font-heading font-extrabold text-lg text-white">
              Chopwize Operations & Trust Console
            </h1>
          </div>
          <p className="text-xs text-white/70 mt-0.5">
            Real-time multi-role marketplace dispatch, hygiene compliance & financial audits
          </p>
        </div>

        {/* Permission Role Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/60">Admin Access:</span>
          <select
            value={adminRole}
            onChange={(e) => setAdminRole(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold focus:outline-none"
          >
            <option value="super_admin" className="text-black">Super-Admin</option>
            <option value="ops_manager" className="text-black">Operations Manager</option>
            <option value="support_agent" className="text-black">Support Specialist</option>
            <option value="finance" className="text-black">Finance Auditor</option>
          </select>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[#EAE5E9] scrollbar-none text-xs font-bold">
        {[
          { id: 'overview', label: 'Operations Overview', icon: Activity },
          { id: 'orders', label: `Live Orders (${activeOrdersCount})`, icon: Receipt },
          { id: 'partners', label: `Partner Approvals (${partnerApps.length})`, icon: Store },
          { id: 'riders', label: 'Rider Fleet', icon: Bike },
          { id: 'tickets', label: `Support Cases (${openTicketsCount})`, icon: HelpCircle },
          { id: 'settings', label: 'Platform Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#30102F] text-[#30102F] bg-white font-extrabold'
                  : 'border-transparent text-[#716B71] hover:text-[#242124]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#CBB477]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-[11px] font-bold text-[#716B71] uppercase">Active Orders</span>
              <p className="font-heading font-extrabold text-2xl text-[#30102F] tabular-nums mt-1">
                {activeOrdersCount}
              </p>
              <span className="text-[10px] text-[#287A55] font-semibold mt-0.5 block">Across Lekki & VI</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-[11px] font-bold text-[#716B71] uppercase">Overdue Prep</span>
              <p className="font-heading font-extrabold text-2xl text-[#9A6A18] tabular-nums mt-1">
                {overdueAlertsCount}
              </p>
              <span className="text-[10px] text-[#9A6A18] font-semibold mt-0.5 block">Under monitoring</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-[11px] font-bold text-[#716B71] uppercase">Riders Online</span>
              <p className="font-heading font-extrabold text-2xl text-[#287A55] tabular-nums mt-1">
                {riderState.isOnline ? '1 Active' : '0 Online'}
              </p>
              <span className="text-[10px] text-[#716B71] mt-0.5 block">Fleet availability OK</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-[11px] font-bold text-[#716B71] uppercase">Open Cases</span>
              <p className="font-heading font-extrabold text-2xl text-[#B33B43] tabular-nums mt-1">
                {openTicketsCount}
              </p>
              <span className="text-[10px] text-[#716B71] mt-0.5 block">Average resolution 18m</span>
            </div>
          </div>

          {/* Live Incident Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">
                  Lagos Lekki Phase 1 Traffic Advisory
                </p>
                <p className="text-amber-800/80 mt-0.5">
                  Admiralty Way roundabout slow due to evening rush. Dispatch buffer auto-adjusted by +8 minutes.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
              Active Advisory
            </span>
          </div>

          {/* Recent Orders Snapshot */}
          <div className="bg-white rounded-3xl border border-[#EAE5E9] p-5">
            <h3 className="font-heading font-bold text-sm text-[#242124] mb-3">
              Live Order Feed Snapshot
            </h3>
            <div className="divide-y divide-[#EAE5E9]">
              {orders.slice(0, 3).map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#242124]">#{o.orderNumber}</span>
                    <span className="text-[#716B71] ml-2">{o.restaurantName} → {o.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#30102F]">₦{o.total.toLocaleString()}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAF3F9] text-[#30102F]">
                      {o.timelineState.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Orders Management & Manual Rider Assignment */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#716B71] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, restaurant, or area..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EAE5E9] bg-white text-xs"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAE5E9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F4] border-b border-[#EAE5E9] text-[#716B71] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Restaurant</th>
                    <th className="p-3.5">Customer & Area</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Rider</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5 text-right">Dispatch Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5E9]">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F4]/50">
                      <td className="p-3.5 font-bold font-mono text-[#30102F]">
                        #{ord.orderNumber}
                      </td>
                      <td className="p-3.5 font-medium text-[#242124]">
                        {ord.restaurantName}
                      </td>
                      <td className="p-3.5 text-[#716B71]">
                        {ord.customerName} ({ord.serviceArea})
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAF3F9] text-[#30102F] border border-[#30102F]/20">
                          {ord.timelineState.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#242124]">
                        {ord.riderName || 'Awaiting assignment'}
                      </td>
                      <td className="p-3.5 font-bold text-[#242124] tabular-nums">
                        ₦{ord.total.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setReassignModalOrder(ord)}
                          className="px-2.5 py-1 rounded-lg border border-[#EAE5E9] hover:bg-[#FAF3F9] text-[#30102F] font-semibold text-[11px]"
                        >
                          Manual Reassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Partner Management & Verification Queue */}
      {adminTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Kitchen Applications & Hygiene Certification
            </h2>
            <span className="text-xs text-[#716B71]">Audited review pipeline</span>
          </div>

          <div className="divide-y divide-[#EAE5E9] bg-white rounded-3xl border border-[#EAE5E9] overflow-hidden">
            {partnerApps.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[#242124]">{p.name}</h3>
                    <span className="text-[10px] text-[#716B71]">{p.area}</span>
                  </div>
                  <p className="text-[11px] text-[#716B71] mt-0.5">CAC Reference: {p.cac}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                    {p.status.replace(/_/g, ' ')}
                  </span>
                  {p.status !== 'approved' && (
                    <button
                      onClick={() => handleApprovePartner(p.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#287A55] text-white text-xs font-bold"
                    >
                      Approve Partner
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Rider Fleet */}
      {adminTab === 'riders' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] space-y-4">
          <h2 className="font-heading font-bold text-base text-[#242124]">
            Rider Operational Roster
          </h2>
          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#242124]">{riderState.name}</span>
                <span className="text-[#716B71]">({riderState.phone})</span>
              </div>
              <p className="text-[11px] text-[#716B71] mt-0.5">
                Plate: {riderState.plateNumber} · Zone: {riderState.zone} · Rating: ★ {riderState.rating}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riderState.isOnline ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
              {riderState.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: Support & Complaints Desk */}
      {adminTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Customer & Partner Support Tickets ({tickets.length})
            </h2>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#30102F]">Ticket #{t.ticketNumber}</span>
                    <span className="text-[#716B71]">· From: {t.userName} ({t.userRole})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                    {t.status}
                  </span>
                </div>
                <p className="font-semibold text-[#242124]">{t.subject}</p>
                <p className="text-[#716B71] leading-relaxed">{t.description}</p>
                {t.internalNotes && (
                  <div className="p-2.5 rounded-lg bg-[#FAF8F4] border border-[#EAE5E9] text-[11px] text-[#242124]">
                    <strong>Internal Audit Note:</strong> {t.internalNotes}
                  </div>
                )}
                {t.status !== 'resolved' && (
                  <div className="pt-2 border-t border-[#EAE5E9] flex justify-end">
                    <button
                      onClick={() => setResolvingTicketId(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#30102F] text-white text-xs font-bold"
                    >
                      Resolve & Add Note
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ticket resolution modal */}
          {resolvingTicketId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
                <h3 className="font-heading font-bold text-base text-[#242124] mb-2">
                  Resolve Support Case
                </h3>
                <textarea
                  rows={3}
                  placeholder="Enter resolution notes..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4] resize-none"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setResolvingTicketId(null)}
                    className="w-1/2 py-2 rounded-xl border border-[#EAE5E9] text-xs text-[#716B71]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResolveTicket(resolvingTicketId)}
                    className="w-1/2 py-2 rounded-xl bg-[#287A55] text-white text-xs font-bold"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Platform Settings */}
      {adminTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] max-w-xl space-y-4 text-xs">
          <h2 className="font-heading font-bold text-base text-[#242124]">
            Marketplace Platform Parameters
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-[#242124] mb-1">
                Fixed Platform Service Fee (₦):
              </label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#242124] mb-1">
                Kitchen Marketplace Commission (%):
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#242124] mb-1">
                Dispatch Response Timeout (Seconds):
              </label>
              <input
                type="number"
                value={dispatchTimeout}
                onChange={(e) => setDispatchTimeout(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
              />
            </div>

            <button
              onClick={() => showToast('Platform parameters updated and broadcast to services')}
              className="mt-3 px-5 py-2.5 rounded-xl bg-[#30102F] text-white font-bold"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Modal: Manual Rider Reassign */}
      {reassignModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-1">
              Reassign Rider for #{reassignModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#716B71] mb-4">
              All manual reassignments are logged to the operations audit trail.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#242124] mb-1">Select Rider</label>
                <select
                  value={selectedNewRiderName}
                  onChange={(e) => setSelectedNewRiderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                >
                  <option value="Tunde Adeleke (Lekki Zone)">Tunde Adeleke (Lekki Zone)</option>
                  <option value="Ibrahim Musa (VI Zone)">Ibrahim Musa (VI Zone)</option>
                  <option value="Emeka Nwosu (Ikoyi Zone)">Emeka Nwosu (Ikoyi Zone)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#242124] mb-1">Reason for Reassignment</label>
                <input
                  type="text"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setReassignModalOrder(null)}
                  className="w-1/3 py-2 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReassign}
                  className="w-2/3 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold"
                >
                  Confirm Reassign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
