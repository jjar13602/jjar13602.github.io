import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings as SettingsIcon, Save, X, Trash2 } from 'lucide-react';
import { deleteUser } from '../utils/api';

export function Settings({ userData, onSave, onCancel, onDeleteAccount }) {
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('All fields are required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== userData.username) {
      setError('Username does not match');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(userData.email);
      onDeleteAccount();
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
              <CardTitle>Account Settings</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
              </div>
              {error && !showDeleteConfirm && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1"><X className="w-4 h-4 mr-2" />Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="border-2 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-600" />
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
            </div>
            <CardDescription>Permanently delete your account and all associated data</CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Deleting your account will permanently remove all your quiz history, scores, and progress. <strong>This cannot be undone.</strong>
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />Delete My Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-1">This will permanently delete:</p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4 list-disc">
                    <li>Your account and login credentials</li>
                    <li>All quiz attempts and scores</li>
                    <li>Your entire progress history</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmUsername" className="text-red-700">
                    Type your username <strong>{userData.username}</strong> to confirm
                  </Label>
                  <Input
                    id="confirmUsername"
                    type="text"
                    placeholder={userData.username}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="border-red-300 focus:border-red-500"
                  />
                </div>
                {error && showDeleteConfirm && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    disabled={isDeleting || deleteConfirmText !== userData.username}
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setError(''); }}
                  >
                    <X className="w-4 h-4 mr-2" />Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}