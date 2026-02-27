import { useState, useEffect } from 'react';
import { documentService } from '../../services/documentService';

const DocumentVerificationModal = ({ userId, userType, onClose, onVerificationComplete }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocuments(userId);
      setDocuments(response.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      alert('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const currentDoc = documents[currentDocIndex];
    setProcessing(true);
    try {
      await documentService.approveDocument(userId, currentDoc.id, userType);
      alert('Document approved and user verified successfully');
      onVerificationComplete?.();
      onClose();
    } catch (error) {
      alert('Failed to approve document: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    const currentDoc = documents[currentDocIndex];
    setProcessing(true);
    try {
      await documentService.rejectDocument(userId, currentDoc.id, rejectComment);
      alert('Document rejected and notification sent');
      setShowRejectModal(false);
      setRejectComment('');
      onVerificationComplete?.();
      onClose();
    } catch (error) {
      alert('Failed to reject document: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const nextDocument = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
    }
  };

  const previousDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8">
          <div className="text-center text-xl text-gray-600">Loading documents...</div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">No Documents Found</h3>
          <p className="text-gray-600 mb-6">This user has not uploaded any verification documents yet.</p>
          <button 
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentDoc = documents[currentDocIndex];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">📄</span> Document Verification
            </h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Document Navigation */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b">
            <button
              onClick={previousDocument}
              disabled={currentDocIndex === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              ← Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Document {currentDocIndex + 1} of {documents.length}
            </span>
            <button
              onClick={nextDocument}
              disabled={currentDocIndex === documents.length - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Next →
            </button>
          </div>

          {/* Document Display */}
          <div className="p-8">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {currentDoc.type}
              </h4>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <img 
                  src={currentDoc.url} 
                  alt={currentDoc.type}
                  className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Document Info */}
            {currentDoc.uploadedAt && (
              <div className="mb-6 text-center text-gray-600">
                <p>Uploaded: {new Date(currentDoc.uploadedAt).toLocaleString()}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ✓ Approve & Verify User
              </button>
              <button 
                onClick={() => setShowRejectModal(true)}
                disabled={processing}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ✗ Reject Document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Document</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this document:</p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
              autoFocus
            />
            <div className="flex gap-3">
              <button 
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentVerificationModal;
