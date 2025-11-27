import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { Violation } from '@/types';

interface EditViolationModalProps {
    violation: Violation;
    onClose: () => void;
    onSave: (violationId: string, updatedData: Partial<Violation>) => void;
}

export const EditViolationModal: React.FC<EditViolationModalProps> = ({ violation, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        violationType: violation.violationType,
        pointsDeducted: violation.pointsDeducted.toString(),
        description: violation.description,
        location: violation.location,
        date: violation.date,
        time: violation.time,
        recordedBy: violation.recordedBy
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
        if (!formData.violationType || !formData.pointsDeducted) {
            alert('กรอกข้อมูลให้ครบ: ประเภทการกระทำผิด และคะแนนที่หัก');
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

        if (!formData.recordedBy) {
            alert('กรุณากรอกชื่อครูที่บันทึก');
            return;
        }

        const pts = parseInt(formData.pointsDeducted);
        if (!Number.isFinite(pts) || pts <= 0) {
            alert('คะแนนไม่ถูกต้อง');
            return;
        }

        onSave(violation.id, {
            ...formData,
            pointsDeducted: pts
        });
    };

    return (
        <Modal title="แก้ไขการกระทำผิด" onClose={onClose} large>
            <div className="space-y-3">
                <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>นักเรียน:</strong> {violation.studentName} ({violation.studentId})
                    </p>
                </div>

                <Select
                    label="ประเภทการกระทำผิด *"
                    value={formData.violationType}
                    onChange={v => setFormData({ ...formData, violationType: v })}
                    options={violationTypes}
                />

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

                <Input
                    label="บันทึกโดย (ครูที่ปรึกษา) *"
                    value={formData.recordedBy}
                    onChange={v => setFormData({ ...formData, recordedBy: v })}
                />

                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 font-medium"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2.5 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 font-medium"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </Modal>
    );
};
