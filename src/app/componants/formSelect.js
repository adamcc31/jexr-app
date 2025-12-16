'use client'
import React from "react";
import Select from 'react-select';
import { FiBriefcase, FiMapPin, FiSearch } from "../assets/icons/vander"

export default function FormSelect() {
    const locationId = React.useId();
    const typeId = React.useId();

    let location = [
        { value: 'Jakarta', label: 'Jakarta' },
        { value: 'Bandung', label: 'Bandung' },
        { value: 'Surabaya', label: 'Surabaya' },
        { value: 'Solo', label: 'Solo' },
        { value: 'Semarang', label: 'Semarang' },
        { value: 'Bali', label: 'Bali' },
        { value: 'Banten', label: 'Banten' },
        { value: 'Tanggerang', label: 'Tanggerang' },
        { value: 'Jawa Tengah', label: 'Jawa Tengah' },
        { value: 'Jawa Timur', label: 'Jawa Timur' },
        { value: 'Sumatera', label: 'Sumatera' },
    ];
    let type = [
        { value: 'Full Time', label: 'Full Time' },
        { value: 'Part Time', label: 'Part Time' },
        { value: 'Freelancer', label: 'Freelancer' },
        { value: 'Remote Work', label: 'Remote Work' },
        { value: 'Office Work', label: 'Office Work' },
    ];
    return (
        <>
            <form className="card-body text-start">
                <div className="registration-form text-dark text-start">
                    <div className="row g-lg-0">
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Search :</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiSearch className="fea icon-20 icons" />
                                    <input name="name" type="text" id="job-keyword" className="form-control filter-input-box bg-light border-0" placeholder="Search your keaywords" />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Location:</label>
                                <div className="filter-search-form position-relative filter-border">
                                    <FiMapPin className="fea icon-20 icons" />
                                    <Select className="form-input border-0" options={location} instanceId={locationId} classNamePrefix="react-select" />

                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="mb-3 mb-sm-0">
                                <label className="form-label d-none fs-6">Type :</label>
                                <div className="filter-search-form relative filter-border">
                                    <FiBriefcase className="fea icon-20 icons" />
                                    <Select className="form-input border-0" options={type} instanceId={typeId} classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12">
                            <input type="submit" id="search" name="search" style={{ height: '60px' }} className="btn btn-primary searchbtn w-100" value="Search" />
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}