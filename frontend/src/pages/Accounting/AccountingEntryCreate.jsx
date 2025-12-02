import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common';
import { AccountingEntryForm } from '../../components/forms';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import accountingEntryService from '../../services/accountingEntryService';

const AccountingEntryCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Écritures', path: '/dashboard/accounting/entries' },
      { label: 'Nouvelle écriture' }
    ]));
  }, [dispatch]);

  const handleSubmit = async (entryData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await accountingEntryService.create(entryData);
      navigate('/dashboard/accounting/entries');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/accounting/entries');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle écriture comptable</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Créer une nouvelle écriture au journal</p>
        </div>
        <Button variant="ghost" onClick={handleCancel}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Annuler
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <AccountingEntryForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </Card>
    </div>
  );
};

export default AccountingEntryCreate;
