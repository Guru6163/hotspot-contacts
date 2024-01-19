
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AddModalContact from './AddContactModal';
import contactService from "../services/api"


export default function ContactsTable() {
    const [contacts, setContacts] = useState([]);
    const [visible, setVisible] = useState(false)
    const [update, setUpdate] = useState(false)

    const fetchContacts = async () => {
        try {
            const contacts = await contactService.getAllContacts();
            setContacts(contacts)
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        fetchContacts()
    }, [update])

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                    <Button onClick={() => setVisible(true)} label='Add Contact'></Button>
                </div>
                <div className='flex gap-2'>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Keyword Search" />
                    </span>
                    <Button onClick={() => contactService.downloadCsv(contacts)} label='Export as CSV'></Button>
                    <Button onClick={() => contactService.downloadVcf(contacts)} label='Export as VCF'></Button>

                </div>
            </div>
        );
    };

    const header = renderHeader();

    const nameBodyTemplate = (rowData) => {
        const nameParts = rowData?.name?.split("-");
        const lastPart = nameParts ? nameParts[nameParts.length - 1] : null;

        return (
            <div>
                {lastPart}
            </div>
        );
    };


    return (
        <div className="card px-7">
            <DataTable header={header}
                paginator rows={5} rowsPerPageOptions={[10, 25, 50]} size='medium' value={contacts} showGridlines >
                <Column sortable field="id" header="Contact ID"></Column>
                <Column body={nameBodyTemplate} header="Name"></Column>
                <Column field="phoneNumber" header="Phone Number"></Column>
                <Column field="enquiry" header="Requirements"></Column>
            </DataTable>
            <AddModalContact visible={visible} setVisible={setVisible} update={update} setUpdate={setUpdate} />
        </div>
    );
}
