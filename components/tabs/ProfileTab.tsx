import React, { useState } from 'react';
import { User, Mail, Phone, Image as ImageIcon, Save, Camera, Shield, Edit3 } from 'lucide-react';
import { cx } from '@/utils/helpers';
import type { UserAccount } from '@/types';

interface ProfileTabProps {
    darkMode: boolean;
    currentUser: UserAccount | null;
    onUpdateProfile: (updates: Partial<UserAccount>) => Promise<void>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
    darkMode,
    currentUser,
    onUpdateProfile
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        bio: currentUser?.bio || '',
        avatar: currentUser?.avatar || ''
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdateProfile(formData);
            setIsEditing(false);
            alert('บันทึกข้อมูลสำเร็จ!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            bio: currentUser?.bio || '',
            avatar: currentUser?.avatar || ''
        });
        setIsEditing(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!currentUser) {
        return <div className="text-center py-12">กรุณาเข้าสู่ระบบ</div>;
    }

    const roleInfo = {
        admin: { label: 'ผู้ดูแลระบบ', emoji: '👨‍💼', color: 'from-purple-500 to-indigo-600' },
        teacher: { label: 'ครู', emoji: '👨‍🏫', color: 'from-blue-500 to-cyan-600' },
        student: { label: 'นักเรียน', emoji: '🎓', color: 'from-green-500 to-emerald-600' }
    };

    const role = roleInfo[currentUser.role];

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                        <User className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">โปรไฟล์ของฉัน</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">จัดการข้อมูลส่วนตัว</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                    >
                        <Edit3 size={18} /> แก้ไขข้อมูล
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className={cx(
                'rounded-2xl shadow-lg p-8',
                darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
            )}>
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-700">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{formData.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:scale-110">
                                <Camera size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">{formData.name}</h3>
                    <div className={cx(
                        'mt-2 px-4 py-1.5 rounded-full text-white text-sm font-medium bg-gradient-to-r',
                        role.color
                    )}>
                        {role.emoji} {role.label}
                    </div>
                    {currentUser.studentId && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Shield size={14} />
                            รหัสนักเรียน: {currentUser.studentId}
                        </p>
                    )}
                </div>

                {/* Profile Information */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                <User size={16} className="text-indigo-500" />
                                ชื่อ-นามสกุล
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="กรอกชื่อ-นามสกุล"
                                    className="w-full px-4 py-3 border-2 border-transparent rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
                                />
                            ) : (
                                <p className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-white">{formData.name || '-'}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                <Mail size={16} className="text-purple-500" />
                                อีเมล
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="กรอกอีเมล"
                                    className="w-full px-4 py-3 border-2 border-transparent rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
                                />
                            ) : (
                                <p className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-white">{formData.email || '-'}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                <Phone size={16} className="text-green-500" />
                                เบอร์โทรศัพท์
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="กรอกเบอร์โทรศัพท์"
                                    className="w-full px-4 py-3 border-2 border-transparent rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
                                />
                            ) : (
                                <p className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-800 dark:text-white">{formData.phone || '-'}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                <User size={16} className="text-blue-500" />
                                ชื่อผู้ใช้
                            </label>
                            <p className="py-3 px-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-gray-500">
                                {currentUser.username}
                                <span className="text-xs ml-2">(ไม่สามารถแก้ไขได้)</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                            <ImageIcon size={16} className="text-pink-500" />
                            เกี่ยวกับฉัน
                        </label>
                        {isEditing ? (
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="เขียนข้อมูลเกี่ยวกับตัวคุณ..."
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-transparent rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all resize-none"
                            />
                        ) : (
                            <p className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl min-h-[100px] whitespace-pre-wrap text-gray-800 dark:text-white">
                                {formData.bio || 'ยังไม่ได้กรอกข้อมูล'}
                            </p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium"
                                disabled={saving}
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
                                disabled={saving}
                            >
                                <Save size={18} />
                                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
