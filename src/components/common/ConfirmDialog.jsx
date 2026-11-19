import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ConfirmDialog = ({ title = 'Please confirm', message, onConfirm, onCancel }) => (
  <Modal title={title} onClose={onCancel}>
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-5 flex justify-end gap-3">
      <Button variant="light" onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </div>
  </Modal>
);
