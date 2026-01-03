import { useState, useEffect } from 'react';
import {
    fetchFullCandidateProfile,
    updateFullCandidateProfile,
    fetchMasterSkills
} from '@/lib/candidate-api';
import type { CandidateWithFullDetails, Skill } from '@/types/candidate';
import Swal from 'sweetalert2';

export function useCandidateProfile() {
    const [profile, setProfile] = useState<CandidateWithFullDetails | null>(null);
    const [masterSkills, setMasterSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [profileData, skillsData] = await Promise.all([
                fetchFullCandidateProfile().catch(() => null), // Allow null if 404/empty
                fetchMasterSkills()
            ]);

            if (profileData) {
                setProfile(profileData);
            } else {
                // Initialize empty structure if not found (or handle partial)
                // For now, let's assume if 404, we rely on the component to show empty form or init default
            }

            setMasterSkills(skillsData || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (data: CandidateWithFullDetails) => {
        try {
            setSaving(true);
            await updateFullCandidateProfile(data);
            setProfile(data); // Optimistic update or reload?
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Profile updated successfully',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err: any) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Failed to update profile'
            });
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return {
        profile,
        masterSkills,
        loading,
        saving,
        error,
        saveProfile,
        refresh: loadData
    };
}
