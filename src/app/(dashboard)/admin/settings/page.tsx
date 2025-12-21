'use client';

/**
 * System Settings Page
 * 
 * Admin page for viewing platform configuration.
 * Currently read-only, prepared for future extensibility.
 */

import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import IconifyIcon from '@/components/dashboard-view/wrappers/IconifyIcon';

/**
 * SettingsCard - Individual settings group card
 */
function SettingsCard({
    title,
    icon,
    children
}: {
    title: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2">
                <IconifyIcon icon={icon} width={20} height={20} className="text-primary" />
                <h6 className="mb-0 fw-semibold">{title}</h6>
            </Card.Header>
            <Card.Body>{children}</Card.Body>
        </Card>
    );
}

/**
 * SettingRow - Individual setting display row
 */
function SettingRow({
    label,
    value,
    badge
}: {
    label: string;
    value: string | number;
    badge?: { text: string; variant: string };
}) {
    return (
        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span className="text-muted">{label}</span>
            <div className="d-flex align-items-center gap-2">
                <span className="fw-medium">{value}</span>
                {badge && (
                    <Badge bg={badge.variant}>{badge.text}</Badge>
                )}
            </div>
        </div>
    );
}

/**
 * FeatureToggle - Feature flag display
 */
function FeatureToggle({ name, enabled }: { name: string; enabled: boolean }) {
    return (
        <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <span className="text-muted">{name}</span>
            <Badge bg={enabled ? 'success' : 'secondary'}>
                {enabled ? 'Enabled' : 'Disabled'}
            </Badge>
        </div>
    );
}

/**
 * SystemSettingsPage - Platform configuration display
 * 
 * Note: These are placeholder values. In production, these would
 * be fetched from the backend /api/admin/settings endpoint.
 */
export default function SystemSettingsPage() {
    // Placeholder settings - would be fetched from API in production
    const settings = {
        platformName: 'J-Expert Recruitment',
        version: '1.0.0',
        environment: 'development',
        features: {
            emailNotifications: true,
            smsNotifications: false,
            socialLogin: true,
            twoFactorAuth: false,
            jobAlerts: true,
            companyReviews: false,
        },
        limits: {
            maxJobsPerEmployer: 50,
            maxApplicationsPerCandidate: 100,
            jobExpirationDays: 30,
            maxResumeSize: '5MB',
        },
    };

    return (
        <div className="system-settings-page">
            {/* Page Header */}
            <div className="mb-4">
                <h4 className="fw-bold mb-1">System Settings</h4>
                <p className="text-muted mb-0">
                    View platform configuration (read-only)
                </p>
            </div>

            {/* Info Banner */}
            <Card className="border-0 bg-primary bg-opacity-10 mb-4">
                <Card.Body className="d-flex align-items-center gap-3">
                    <IconifyIcon
                        icon="solar:info-circle-bold"
                        width={24}
                        height={24}
                        className="text-primary"
                    />
                    <div>
                        <strong className="text-primary">Configuration is Read-Only</strong>
                        <p className="mb-0 text-muted small">
                            These settings are managed via environment variables and backend configuration.
                            Contact your system administrator to make changes.
                        </p>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* Platform Info */}
                <Col xs={12} md={6}>
                    <SettingsCard title="Platform Information" icon="solar:server-bold-duotone">
                        <SettingRow
                            label="Platform Name"
                            value={settings.platformName}
                        />
                        <SettingRow
                            label="Version"
                            value={settings.version}
                            badge={{ text: 'Latest', variant: 'success' }}
                        />
                        <SettingRow
                            label="Environment"
                            value={settings.environment.charAt(0).toUpperCase() + settings.environment.slice(1)}
                            badge={{
                                text: settings.environment === 'production' ? 'Live' : 'Dev',
                                variant: settings.environment === 'production' ? 'danger' : 'warning'
                            }}
                        />
                    </SettingsCard>
                </Col>

                {/* Platform Limits */}
                <Col xs={12} md={6}>
                    <SettingsCard title="Platform Limits" icon="solar:ruler-bold-duotone">
                        <SettingRow
                            label="Max Jobs per Employer"
                            value={settings.limits.maxJobsPerEmployer}
                        />
                        <SettingRow
                            label="Max Applications per Candidate"
                            value={settings.limits.maxApplicationsPerCandidate}
                        />
                        <SettingRow
                            label="Job Expiration"
                            value={`${settings.limits.jobExpirationDays} days`}
                        />
                        <SettingRow
                            label="Max Resume Size"
                            value={settings.limits.maxResumeSize}
                        />
                    </SettingsCard>
                </Col>

                {/* Feature Flags */}
                <Col xs={12}>
                    <SettingsCard title="Feature Flags" icon="solar:bolt-bold-duotone">
                        <Row>
                            <Col xs={12} md={6}>
                                <FeatureToggle
                                    name="Email Notifications"
                                    enabled={settings.features.emailNotifications}
                                />
                                <FeatureToggle
                                    name="SMS Notifications"
                                    enabled={settings.features.smsNotifications}
                                />
                                <FeatureToggle
                                    name="Social Login"
                                    enabled={settings.features.socialLogin}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <FeatureToggle
                                    name="Two-Factor Authentication"
                                    enabled={settings.features.twoFactorAuth}
                                />
                                <FeatureToggle
                                    name="Job Alerts"
                                    enabled={settings.features.jobAlerts}
                                />
                                <FeatureToggle
                                    name="Company Reviews"
                                    enabled={settings.features.companyReviews}
                                />
                            </Col>
                        </Row>
                    </SettingsCard>
                </Col>
            </Row>

            {/* Future Extensibility Note */}
            <Card className="border-0 mt-4 bg-light">
                <Card.Body className="text-center py-4">
                    <IconifyIcon
                        icon="solar:settings-minimalistic-bold-duotone"
                        width={48}
                        height={48}
                        className="text-muted mb-3"
                    />
                    <h6 className="text-muted">More Settings Coming Soon</h6>
                    <p className="text-muted small mb-0">
                        Additional configuration options will be available in future updates.
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
}
