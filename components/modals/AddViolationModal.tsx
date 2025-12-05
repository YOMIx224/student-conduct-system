import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { Student, Violation, UserAccount } from '@/types';

interface AddViolationModalProps {
  students: Student[];
  onClose: () => void;
  onAdd: (violation: Omit<Violation, 'id' | 'studentName' | 'appeals' | 'recordedBy'> & { recordedBy: string }) => void;
  currentUser: UserAccount | null;
}

export const AddViolationModal: React.FC<AddViolationModalProps> = ({ students, onClose, onAdd, currentUser }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    violationType: '',
    pointsDeducted: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
  });

  const violationTypes = [
    'มาสายไม่มีใบลา',
    'ขาดเรียนไม่มีใบลา',
    'แต่งกายไม่เหมาะสม',
    'ทำความประพฤติไม่เหมาะสม',
    'สูบบุหรี่',
    'ไม่ทำการบ้าน',
    'ใช้โทรศัพท์ในห้องเรียน',
    'อื่นๆ'
  ];

  const handleSubmit = () => {
    if (!formData.studentId || !formData.violationType || !formData.pointsDeducted) {
      alert('กรอกข้อมูลให้ครบ: รหัสนักเรียน, ประเภทการกระทำผิด, และคะแนนที่หัก');
      return;
    }

    if (!formData.description) {
      alert('กรุณากรอกรายละเอียดการกระทำผิด');
      return;
    }

    if (!formData.location) {
      alert('กรุณากรอกสถานที่');
      return;
    }

    const pts = parseInt(formData.pointsDeducted);
    if (!Number.isFinite(pts) || pts <= 0) {
      alert('คะแนนไม่ถูกต้อง');
      return;
    }

    if (!currentUser?.name) {
        alert('ไม่พบชื่อผู้บันทึก กรุณาลองเข้าสู่ระบบอีกครั้ง');
        return;
    }

    onAdd({
      ...formData,
      pointsDeducted: pts,
      recordedBy: currentUser.name,
    });
  };

  return (
    <Modal title="บันทึกการกระทำผิด" onClose={onClose} large>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="รหัสนักเรียน *"
            value={formData.studentId}
            onChange={v => setFormData({ ...formData, studentId: v })}
          />
          <Select
            label="ประเภทการกระทำผิด *"
            value={formData.violationType}
            onChange={v => setFormData({ ...formData, violationType: v })}
            options={violationTypes}
          />
        </div>

        <Textarea
          label="รายละเอียด *"
          value={formData.description}
          onChange={v => setFormData({ ...formData, description: v })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="หักคะแนน *"
            type="number"
            value={formData.pointsDeducted}
            onChange={v => setFormData({ ...formData, pointsDeducted: v })}
          />
          <Input
            label="วันที่ *"
            type="date"
            value={formData.date}
            onChange={v => setFormData({ ...formData, date: v })}
          />
          <Input
            label="เวลา *"
            type="time"
            value={formData.time}
            onChange={v => setFormData({ ...formData, time: v })}
          />
        </div>

        <Input
          label="สถานที่ *"
          value={formData.location}
          onChange={v => setFormData({ ...formData, location: v })}
        />



        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 text-white py-2.5 rounded-md hover:bg-red-600 font-medium"
        >
          บันทึกการกระทำผิด
        </button>
      </div>
    </Modal>
  );
};