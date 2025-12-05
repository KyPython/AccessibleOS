import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Camera, Mail, Calendar, Shield } from '../Icons/Icons';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { formatDate } from '../../utils/formatters';
import styles from './UserProfile.module.css';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // AuthContext currently uses a mock store; simulate save locally
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className={styles.loading}>
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.header}>
        <h2 className="heading-3">Profile Settings</h2>
        <p className="body-base text-muted">
          Manage your account information and preferences
        </p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={`${user.displayName || user.email}'s avatar`}
                width={80}
                height={80}
              />
            ) : (
              <User size={40} />
            )}
          </div>
          <Button variant="ghost" size="sm" className={styles.changeAvatar}>
            <Camera size={16} />
            Change Photo
          </Button>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Mail size={16} />
                Email
              </div>
              <div className={styles.infoValue}>{user.email}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <User size={16} />
                Display Name
              </div>
              <div className={styles.infoValue}>
                {user.displayName || 'Not set'}
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Calendar size={16} />
                Member Since
              </div>
              <div className={styles.infoValue}>
                {formatDate(user.createdAt)}
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>
                <Shield size={16} />
                Account Status
              </div>
              <div className={styles.infoValue}>
                <span
                  className={`${styles.status} ${
                    user.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        size="md"
      >
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <Input
            label="Display Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your display name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            helperText="Email cannot be changed"
          />

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;
