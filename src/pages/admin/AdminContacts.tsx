import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Clock, Trash2, ExternalLink, X, Search } from 'lucide-react';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'resolved';
  created_at: string;
}

const renderMessageWithLinks = (text: string) => {
  if (!text) return "Không có nội dung lời nhắn";
  
  // Regex to detect URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 font-bold underline break-all inline-block bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded transition-colors my-0.5"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const AdminContacts = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<string>('pending');
  const [saving, setSaving] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let url = '/contact';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const response = await apiGet(url);
      if (response && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách liên hệ:', error);
      toast.error('Lỗi tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa yêu cầu liên hệ này?')) return;
    try {
      await apiDelete(`/contact/${id}`);
      toast.success('Đã xóa yêu cầu liên hệ');
      setRequests(requests.filter(req => req.id !== id));
      if (selectedRequest?.id === id) setIsModalOpen(false);
    } catch (error) {
      toast.error('Lỗi xóa yêu cầu');
    }
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setSaving(true);
    try {
      await apiPatch(`/contact/${selectedRequest.id}`, {
        status: editStatus,
        notes: editNotes
      });
      toast.success('Đã cập nhật trạng thái');
      fetchContacts();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const openDetails = (req: ContactRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditNotes(req.notes || '');
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case 'contacted': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1"><Mail className="w-3 h-3" /> Đã liên hệ</span>;
      case 'resolved': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Đã giải quyết</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const filteredRequests = requests.filter(req => 
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.phone.includes(searchQuery) ||
    (req.email && req.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout title="Liên hệ">
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yêu cầu liên hệ</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các yêu cầu từ trang liên hệ của khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            {['all', 'pending', 'contacted', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === status 
                    ? 'bg-white shadow-sm border border-gray-200 text-red-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'Tất cả' : 
                 status === 'pending' ? 'Chờ xử lý' : 
                 status === 'contacted' ? 'Đã liên hệ' : 'Đã giải quyết'}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm tên, SĐT..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Thông tin</th>
                <th className="p-4 font-medium hidden md:table-cell">Loại yêu cầu</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Không có yêu cầu liên hệ nào.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{req.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{new Date(req.created_at).toLocaleString('vi-VN')}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 font-medium">{req.phone}</div>
                      <div className="text-gray-500 text-xs">{req.email || 'Không có email'}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell max-w-[220px]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 truncate max-w-full">
                        {req.message}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openDetails(req)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(req.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Chi tiết yêu cầu #{selectedRequest.id}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Khách hàng</p>
                  <p className="font-semibold text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thời gian gửi</p>
                  <p className="font-medium text-gray-900">{new Date(selectedRequest.created_at).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <a href={`tel:${selectedRequest.phone}`} className="font-medium text-blue-600 hover:underline">{selectedRequest.phone}</a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedRequest.email || '-'}</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-semibold">Nội dung chi tiết / Đường dẫn CV</p>
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm bg-white p-3 rounded-lg border border-gray-150">
                  {renderMessageWithLinks(selectedRequest.message)}
                </div>
                
                {selectedRequest.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Nội dung ghi chú của khách hàng</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-4">Cập nhật trạng thái xử lý</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {(['pending', 'contacted', 'resolved'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditStatus(s)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border text-center transition-all ${
                        editStatus === s 
                          ? s === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700 ring-2 ring-amber-200'
                          : s === 'contacted' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-200'
                          : 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s === 'pending' ? 'Chờ xử lý' : s === 'contacted' ? 'Đã liên hệ' : 'Đã giải quyết'}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú nội bộ</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Ghi chú kết quả liên hệ, thỏa thuận..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-y min-h-[80px] text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminContacts;
