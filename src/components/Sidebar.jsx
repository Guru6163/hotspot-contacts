// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';
import { Button } from "primereact/button"
import Icon from "../assets/icon.svg"
import { InputText } from "primereact/inputtext"
import { Calendar } from "primereact/calendar"
import contactService from '../services/api';

const Sidebar = ({ dates, setDates, keyword, setKeyword, setFilteredContacts, filteredContacts }) => {

    const handleFilter = async () => {
        try {
            const filtered = await contactService.getAllContacts(dates?.[0], dates?.[1], keyword);
            setFilteredContacts(filtered);
        } catch (error) {
            console.error('Error filtering contacts:', error);
        }
    };

    const removeFilters = async () => {
        const resp = await contactService.getAllContacts()
        setFilteredContacts(resp)
    }

    return (
        <div className='sidebar'>
            <div className='text-center'>
                <img style={{ width: "200px" }} alt="" src={Icon} />
            </div>
            <div className='px-4 gap-2 flex flex-column'>
                <InputText
                    placeholder="Global Search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Calendar
                    placeholder="Date Range"
                    value={dates}
                    onChange={(e) => setDates(e.value)} 
                    selectionMode="range"
                    readOnlyInput
                />
                <div className="flex flex-column">
                    <div className='flex flex-column gap-2 '>
                        <Button icon="pi pi-filter" onClick={() => handleFilter()} label='Apply Filter' className="toggle-btn w-full" />
                        <Button icon="pi pi-filter-slash" onClick={() => removeFilters()} label='Clear Filters' className="toggle-btn w-full" />
                    </div>
                    <div className='button-container flex flex-column gap-2 px-4'>
                        <Button icon="pi pi-download" onClick={() => contactService.downloadVcf(filteredContacts)} label='Download as VCF' className="toggle-btn w-full" />
                        <Button icon="pi pi-download" onClick={() => contactService.downloadCsv(filteredContacts)} label='Download as CSV' className="toggle-btn w-full" />
                        <div className='text-center font-semibold mt-3'>Developed By Guru 🧑🏻‍💻</div>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default Sidebar;
