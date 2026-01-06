'use client';

/**
 * ATS Filter Panel Component
 *
 * Collapsible filter panel with filter groups for:
 * - Japanese Proficiency
 * - Competency & Language
 * - Logistics & Availability
 * - Education & Experience
 */

import React from 'react';
import { Card, Accordion, Form, Row, Col, Button } from 'react-bootstrap';
import type { ATSFilter, ATSFilterOptions, SkillOption } from '@/types/ats';
import {
    JLPT_LEVELS,
    JLPT_LABELS,
    GENDERS,
    GENDER_LABELS,
    EDUCATION_LEVELS,
    EDUCATION_LABELS,
    ENGLISH_CERT_TYPES,
} from '@/types/ats';

interface FilterPanelProps {
    filter: ATSFilter;
    options: ATSFilterOptions | undefined;
    optionsLoading: boolean;
    onFilterChange: (filter: ATSFilter) => void;
    onApply: () => void;
    onClear: () => void;
}

export default function FilterPanel({
    filter,
    options,
    optionsLoading,
    onFilterChange,
    onApply,
    onClear,
}: FilterPanelProps) {
    // Helper to update a single filter field
    const updateFilter = <K extends keyof ATSFilter>(key: K, value: ATSFilter[K]) => {
        onFilterChange({ ...filter, [key]: value });
    };

    // Toggle array value (for multi-select)
    const toggleArrayValue = (key: keyof ATSFilter, value: string) => {
        const currentArray = (filter[key] as string[] | undefined) || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter((v) => v !== value)
            : [...currentArray, value];
        updateFilter(key, newArray.length > 0 ? newArray : undefined);
    };

    // Toggle skill ID
    const toggleSkillId = (key: 'technical_skill_ids' | 'computer_skill_ids', id: number) => {
        const currentArray = (filter[key] as number[] | undefined) || [];
        const newArray = currentArray.includes(id)
            ? currentArray.filter((v) => v !== id)
            : [...currentArray, id];
        updateFilter(key, newArray.length > 0 ? newArray : undefined);
    };

    return (
        <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                <h6 className="mb-0 fw-semibold">Filters</h6>
                <Button variant="link" size="sm" onClick={onClear} className="text-muted p-0">
                    Clear All
                </Button>
            </Card.Header>
            <Card.Body className="pt-0">
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    {/* Group 1: Japanese Proficiency */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Japanese Proficiency</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">JLPT Level</Form.Label>
                                <div>
                                    {JLPT_LEVELS.map((level) => (
                                        <Form.Check
                                            key={level}
                                            inline
                                            type="checkbox"
                                            id={`jlpt-${level}`}
                                            label={JLPT_LABELS[level]}
                                            checked={filter.japanese_levels?.includes(level) || false}
                                            onChange={() => toggleArrayValue('japanese_levels', level)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Japan Experience (Months)</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            size="sm"
                                            min={0}
                                            max={480}
                                            value={filter.japan_experience_min ?? ''}
                                            onChange={(e) =>
                                                updateFilter('japan_experience_min', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                    <Col xs="auto" className="px-1 d-flex align-items-center">–</Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            size="sm"
                                            min={0}
                                            max={480}
                                            value={filter.japan_experience_max ?? ''}
                                            onChange={(e) =>
                                                updateFilter('japan_experience_max', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="small text-muted">LPK Training</Form.Label>
                                <div>
                                    <Form.Check
                                        inline
                                        type="radio"
                                        id="lpk-any"
                                        label="Any"
                                        name="lpk"
                                        checked={filter.has_lpk_training === undefined}
                                        onChange={() => updateFilter('has_lpk_training', undefined)}
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        id="lpk-yes"
                                        label="Yes"
                                        name="lpk"
                                        checked={filter.has_lpk_training === true}
                                        onChange={() => updateFilter('has_lpk_training', true)}
                                    />
                                    <Form.Check
                                        inline
                                        type="radio"
                                        id="lpk-no"
                                        label="No"
                                        name="lpk"
                                        checked={filter.has_lpk_training === false}
                                        onChange={() => updateFilter('has_lpk_training', false)}
                                    />
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Group 2: Competency & Language */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Competency & Language</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">English Certification</Form.Label>
                                <div>
                                    {ENGLISH_CERT_TYPES.map((cert) => (
                                        <Form.Check
                                            key={cert}
                                            inline
                                            type="checkbox"
                                            id={`cert-${cert}`}
                                            label={cert}
                                            checked={filter.english_cert_types?.includes(cert) || false}
                                            onChange={() => toggleArrayValue('english_cert_types', cert)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Minimum English Score</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g., 600 for TOEIC"
                                    size="sm"
                                    min={0}
                                    value={filter.english_min_score ?? ''}
                                    onChange={(e) =>
                                        updateFilter('english_min_score', e.target.value ? parseFloat(e.target.value) : undefined)
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Technical Skills</Form.Label>
                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {optionsLoading ? (
                                        <span className="text-muted small">Loading...</span>
                                    ) : (
                                        options?.technical_skills?.map((skill: SkillOption) => (
                                            <Form.Check
                                                key={skill.id}
                                                type="checkbox"
                                                id={`skill-${skill.id}`}
                                                label={skill.name}
                                                checked={filter.technical_skill_ids?.includes(skill.id) || false}
                                                onChange={() => toggleSkillId('technical_skill_ids', skill.id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="small text-muted">Computer Skills</Form.Label>
                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {optionsLoading ? (
                                        <span className="text-muted small">Loading...</span>
                                    ) : (
                                        options?.computer_skills?.map((skill: SkillOption) => (
                                            <Form.Check
                                                key={skill.id}
                                                type="checkbox"
                                                id={`computer-${skill.id}`}
                                                label={skill.name}
                                                checked={filter.computer_skill_ids?.includes(skill.id) || false}
                                                onChange={() => toggleSkillId('computer_skill_ids', skill.id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Group 3: Logistics & Availability */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Logistics & Availability</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Age Range</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            size="sm"
                                            min={18}
                                            max={100}
                                            value={filter.age_min ?? ''}
                                            onChange={(e) =>
                                                updateFilter('age_min', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                    <Col xs="auto" className="px-1 d-flex align-items-center">–</Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            size="sm"
                                            min={18}
                                            max={100}
                                            value={filter.age_max ?? ''}
                                            onChange={(e) =>
                                                updateFilter('age_max', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Gender</Form.Label>
                                <div>
                                    {GENDERS.map((gender) => (
                                        <Form.Check
                                            key={gender}
                                            inline
                                            type="checkbox"
                                            id={`gender-${gender}`}
                                            label={GENDER_LABELS[gender]}
                                            checked={filter.genders?.includes(gender) || false}
                                            onChange={() => toggleArrayValue('genders', gender)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Domicile City</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={filter.domicile_cities?.[0] || ''}
                                    onChange={(e) =>
                                        updateFilter('domicile_cities', e.target.value ? [e.target.value] : undefined)
                                    }
                                >
                                    <option value="">Any City</option>
                                    {options?.domicile_cities?.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Expected Salary (IDR)</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            size="sm"
                                            min={0}
                                            step={1000000}
                                            value={filter.expected_salary_min ?? ''}
                                            onChange={(e) =>
                                                updateFilter('expected_salary_min', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                    <Col xs="auto" className="px-1 d-flex align-items-center">–</Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            size="sm"
                                            min={0}
                                            step={1000000}
                                            value={filter.expected_salary_max ?? ''}
                                            onChange={(e) =>
                                                updateFilter('expected_salary_max', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="small text-muted">Available Start Date (Before)</Form.Label>
                                <Form.Control
                                    type="date"
                                    size="sm"
                                    value={filter.available_start_before || ''}
                                    onChange={(e) => updateFilter('available_start_before', e.target.value || undefined)}
                                />
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Group 4: Education & Experience */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Education & Experience</Accordion.Header>
                        <Accordion.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Education Level</Form.Label>
                                <div>
                                    {EDUCATION_LEVELS.map((level) => (
                                        <Form.Check
                                            key={level}
                                            inline
                                            type="checkbox"
                                            id={`edu-${level}`}
                                            label={EDUCATION_LABELS[level]}
                                            checked={filter.education_levels?.includes(level) || false}
                                            onChange={() => toggleArrayValue('education_levels', level)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-muted">Major Field</Form.Label>
                                <Form.Select
                                    size="sm"
                                    value={filter.major_fields?.[0] || ''}
                                    onChange={(e) =>
                                        updateFilter('major_fields', e.target.value ? [e.target.value] : undefined)
                                    }
                                >
                                    <option value="">Any Major</option>
                                    {options?.major_fields?.map((major) => (
                                        <option key={major} value={major}>
                                            {major}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className="small text-muted">Total Experience (Months)</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            size="sm"
                                            min={0}
                                            value={filter.total_experience_min ?? ''}
                                            onChange={(e) =>
                                                updateFilter('total_experience_min', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                    <Col xs="auto" className="px-1 d-flex align-items-center">–</Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            size="sm"
                                            min={0}
                                            value={filter.total_experience_max ?? ''}
                                            onChange={(e) =>
                                                updateFilter('total_experience_max', e.target.value ? parseInt(e.target.value) : undefined)
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className="mt-3">
                    <Button variant="primary" onClick={onApply} className="w-100">
                        Apply Filters
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
