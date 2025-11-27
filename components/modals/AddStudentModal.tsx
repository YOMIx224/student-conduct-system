import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from '@/components/ui/Input';
import type { Student } from '@/types';

interface AddStudentModalProps {
  onClose: () => void;
  onAdd: (student: Omit<Student, 'id' | 'conductScore'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    class: '',
    department: 'เทคโนโลยีสารสนเทศ',
    phone: '',
    email: ''
  });

  const handleSubmit = () => {
    if (!formData.studentId || !formData.name) {
      alert('กรอกข้อมูลให้ครบ');
      return;
    }
    onAdd(formData);
  };

  return (
    <Modal title="เพิ่มนักเรียนใหม่" onClose={onClose}>
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
        <button 
          onClick={handleSubmit} 
          className="w-full bg-indigo-500 text-white py-2.5 rounded-md hover:bg-indigo-600 font-medium"
        >
          บันทึก
        </button>
      </div>
    </Modal>
  );
};