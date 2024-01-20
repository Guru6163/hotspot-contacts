import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ContactsTable from '../components/ContactsTable'
import contactService from '../services/api';

function Admin() {
    const [dates, setDates] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [contacts, setContacts] = useState([]);
    
    const [filteredContacts, setFilteredContacts] = useState([]);

    return (
        <div>
            <Sidebar dates={dates} setDates={setDates} keyword={keyword} setKeyword={setKeyword} setFilteredContacts={setFilteredContacts} filteredContacts={filteredContacts} />
            <div style={{ marginLeft: '300px', padding: '20px' }}>
                <div className='pb-2 text-xl font-bold'>Contacts Ledger</div>
                <ContactsTable filteredContacts={filteredContacts} setFilteredContacts={setFilteredContacts} setContacts={setContacts} />
            </div>
        </div>
    )
}

export default Admin