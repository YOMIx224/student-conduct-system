import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from '@/components/ui/Input';
import type { Student } from '@/types';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onSave: (id: string, student: Partial<Student>) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        studentId: student.studentId,
        name: student.name,
        class: student.class,
        department: student.department,
        phone: student.phone || '',
        email: student.email || ''
    });

    const handleSubmit = () => {
        if (!formData.studentId || !formData.name) {
            alert('กรอกข้อมูลให้ครบ');
            return;
        }
        onSave(student.id, formData);
        onClose();
    };

    return (
        <Modal title="แก้ไขข้อมูลนักเรียน" onClose={onClose}>
            <div className="space-y-3">
                <Input
                    label="รหัสนักเรียน *"
                    value={formData.studentId}
                    onChange={v => setFormData({ ...formData, studentId: v })}
                />
                <Input
                    label="ชื่อ-นามสกุล *"
                    value={formData.name}
                    onChange={v => setFormData({ ...formData, name: v })}
                />
                <Input
                    label="ชั้นเรียน"
                    value={formData.class}
                    placeholder="เช่น ปวส.1/1"
                    onChange={v => setFormData({ ...formData, class: v })}
                />
                <Input
                    label="แผนกวิชา"
                    value={formData.department}
                    onChange={v => setFormData({ ...formData, department: v })}
                />
                <Input
                    label="เบอร์โทร"
                    value={formData.phone}
                    onChange={v => setFormData({ ...formData, phone: v })}
                />
                <Input
                    label="อีเมล"
                    value={formData.email}
                    onChange={v => setFormData({ ...formData, email: v })}
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-indigo-500 text-white py-2.5 rounded-md hover:bg-indigo-600 font-medium"
                    >
                        บันทึก
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-2.5 rounded-md hover:bg-gray-400 font-medium"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </Modal>
    );
};
