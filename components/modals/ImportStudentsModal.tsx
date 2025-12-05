import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportStudentsModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/students/import', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to import');
            }

            setResult(data);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import students');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-semibold">นำเข้ารายชื่อนักเรียนจาก Excel</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">รูปแบบไฟล์ Excel:</h3>
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>คอลัมน์ที่ต้องมี:</p>
                            <ul className="list-disc list-inside ml-4">
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">studentId</code> - รหัสนักเรียน</li>
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">name</code> - ชื่อ-นามสกุล</li>
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">class</code> - ชั้นเรียน (เช่น ปวช.1/1)</li>
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">department</code> - แผนกวิชา</li>
                            </ul>
                            <p className="mt-2">คอลัมน์เสริม (ไม่บังคับ):</p>
                            <ul className="list-disc list-inside ml-4">
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">phone</code> - เบอร์โทรศัพท์</li>
                                <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">email</code> - อีเมล</li>
                            </ul>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">เลือกไฟล์ Excel (.xlsx, .xls, .csv)</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition"
                            >
                                <div className="text-center">
                                    <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                                    {file ? (
                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">คลิกเพื่อเลือกไฟล์</p>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <CheckCircle className="text-green-600 dark:text-green-400 mr-3 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-green-900 dark:text-green-100">นำเข้าสำเร็จ!</h3>
                                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                                        นำเข้า {result.imported} รายการ
                                        {result.duplicates > 0 && ` (ข้าม ${result.duplicates} รายการที่ซ้ำ)`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="text-red-600 dark:text-red-400 mr-3 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-900 dark:text-red-100">เกิดข้อผิดพลาด</h3>
                                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            disabled={uploading}
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            <Upload size={18} />
                            {uploading ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูล'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
