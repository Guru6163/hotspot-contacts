import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AddModalContact from './AddContactModal';
import { useLocation } from "react-router-dom"
import contactService from '../services/api';

export default function ContactsTable(props) {
    
    const [visible, setVisible] = useState(false);
    const [update, setUpdate] = useState(false);
    const { filteredContacts, setContacts, setFilteredContacts } = props

    const [newSize, setNewSize] = useState("")
    const [nonAuthContacts, setNonAuthContacts] = useState([])

    const location = useLocation()

    const fetchContacts = async () => {
        try {
            const fetchedContacts = await contactService.getAllContacts();
            setContacts(fetchedContacts);
            setFilteredContacts(fetchedContacts); // Initialize filteredContacts with all contacts
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, [update]);

    useEffect(() => {
        if (location.pathname !== '/admin') {
            setNewSize("p-7")
            contactService.getLast20Collections().then(res => setNonAuthContacts(res))
        }
    }, [location])

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div className='flex gap-2'>
                    <Button icon="pi pi-user-plus" onClick={() => setVisible(true)} label="Add Contact"></Button>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const nameBodyTemplate = (rowData) => {
        const nameParts = rowData?.name?.split('-');
        const lastPart = nameParts ? nameParts[nameParts.length - 1] : null;
        return <div>{lastPart}</div>;
    };


    const createdAtTemplate = (rowData) => {
        const timestamp = new Date(rowData?.createdAt?.seconds * 1000 + rowData?.createdAt?.nanoseconds / 1e6);
        return <div>{timestamp.toLocaleString()}</div>;
    };

    return (
        <div className={`card ${newSize}`}>
            <DataTable
                header={header}
                selectionMode={true ? null : 'radiobutton'}
                dataKey="id"
                paginator
                rows={5}
                rowsPerPageOptions={[10, 25, 50]}
                size="medium"
                value={newSize === 'p-7' ? nonAuthContacts : filteredContacts}
                showGridlines
            >
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column sortable field="id" header="Contact ID"></Column>
                <Column body={nameBodyTemplate} header="Name"></Column>
                <Column field="phoneNumber" header="Phone Number"></Column>
                <Column field="requirements" header="Requirements"></Column>
                <Column field='fulfilled' header="Fulfillment"></Column>
                <Column body={createdAtTemplate} header="Created At"></Column>

            </DataTable>
            <AddModalContact visible={visible} setVisible={setVisible} update={update} setUpdate={setUpdate} />
        </div>
    );
}
