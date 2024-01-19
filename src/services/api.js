// contactService.js
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, setDoc, orderBy } from '@firebase/firestore';

const addOrUpdateContact = async (name, phoneNumber, enquiry) => {
    try {
        // Check if there are existing contacts
        const allContactsQuery = query(collection(db, 'contacts'));
        const allContactsSnapshot = await getDocs(allContactsQuery);

        let contactId;
        if (allContactsSnapshot.size === 0) {
            // If no contacts exist, start with C00001
            contactId = 'C00001';
        } else {
            // Find the latest contact and increment the number
            const latestContact = allContactsSnapshot.docs[allContactsSnapshot.size - 1].data();
            const latestContactId = latestContact.id || 'C00000'; // Handle undefined or missing id property

            // Extract the numeric part and increment
            const numericPart = parseInt(latestContactId.slice(1), 10);
            contactId = `C${String(numericPart + 1).padStart(5, '0')}`;
        }

        const timestamp = new Date(); // Current timestamp

        // Check if the phoneNumber exists
        const contactQuery = query(collection(db, 'contacts'), where('phoneNumber', '==', phoneNumber));
        const contactSnapshot = await getDocs(contactQuery);

        if (contactSnapshot.size > 0) {
            // Update existing contact
            const contactDoc = contactSnapshot.docs[0];
            await updateDoc(doc(db, 'contacts', contactDoc.id), {
                // Exclude the ID field from the data being updated
                name: `${contactDoc.id}-${name}`,
                phoneNumber,
                enquiry,
                createdAt: timestamp, // Add createdAt field
            });

            return { message: 'Contact updated successfully.' };
        } else {
            // Create a new contact with specified ID
            await setDoc(doc(db, 'contacts', contactId), {
                id: contactId, // Include the ID in the document data
                name: `${contactId}-${name}`,
                phoneNumber,
                enquiry,
                createdAt: timestamp, // Add createdAt field
            });

            return { message: 'Contact added successfully.', contactId };
        }
    } catch (error) {
        console.error('Error adding/updating contact:', error);
        throw new Error('Internal Server Error');
    }
};


const getAllContacts = async () => {
    try {
        // Query to get all contacts ordered by the creation timestamp in descending order
        const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const contactsSnapshot = await getDocs(contactsQuery);

        // Extract data from the snapshot
        const contacts = contactsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return contacts;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Internal Server Error');
    }
};


const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

const convertToCsv = (contacts) => {
    const headers = ['Name', 'Phone Number'];
    const csvData = contacts.map(contact => [contact.name, contact.phoneNumber]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    return csvContent;
};

const convertToVcf = (contacts) => {
    const vcfData = contacts.map(contact => (
        `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL:${contact.phoneNumber}
END:VCARD`
    ));
    return vcfData.join('\n');
};

const downloadCsv = (contacts) => {
    const csvContent = convertToCsv(contacts);
    downloadFile(csvContent, 'contacts.csv', 'text/csv');
};

const downloadVcf = (contacts) => {
    const vcfContent = convertToVcf(contacts);
    downloadFile(vcfContent, 'contacts.vcf', 'text/vcard');
};

// Usage in your code after fetching contacts
// Example:
// const contacts = await getAllContacts();
// downloadCsv(contacts);
// downloadVcf(contacts);


const contactService = { addOrUpdateContact, getAllContacts , downloadCsv, downloadVcf }


export default contactService;
