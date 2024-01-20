// contactService.js
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, where, updateDoc,limit, doc, setDoc, orderBy } from '@firebase/firestore';

const addOrUpdateContact = async (name, phoneNumber, requirements) => {
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

        let fulfilledStatus = requirements.length > 0 ? 'Pending' : 'None';
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
                requirements,
                createdAt: timestamp, // Add createdAt field
                fulfilled: fulfilledStatus, // Update fulfilled status
            });

            return { message: 'Contact updated successfully.' };
        } else {
            // Create a new contact with specified ID
            await setDoc(doc(db, 'contacts', contactId), {
                id: contactId, // Include the ID in the document data
                name: `${contactId}-${name}`,
                phoneNumber,
                requirements,
                createdAt: timestamp, // Add createdAt field
                fulfilled: fulfilledStatus,
            });

            return { message: 'Contact added successfully.', contactId };
        }
    } catch (error) {
        console.error('Error adding/updating contact:', error);
        throw new Error('Internal Server Error');
    }
};


const getAllContacts = async (startDate = null, endDate = null, keyword = null) => {
    try {
        let contactsQuery = query(
            collection(db, 'contacts'),
            orderBy('createdAt', 'desc')
        );

        // Apply date range filter
        if (startDate && endDate) {
            const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
            const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);

            contactsQuery = query(contactsQuery, where('createdAt', '>=', new Date(startTimestamp)));
            contactsQuery = query(contactsQuery, where('createdAt', '<=', new Date(endTimestamp)));
        }

        // Apply keyword search globally
        if (keyword) {
            const normalizedKeyword = keyword.toLowerCase();

            // Perform a global search across all fields in all collections
            const allCollections = ['contacts']; // Add more collection names as needed

            // Array to store promises for each collection
            const collectionPromises = allCollections.map(async (collectionName) => {
                const collectionRef = collection(db, collectionName);

                // Get all documents in the current collection
                const querySnapshot = await getDocs(collectionRef);

                // Filter documents that contain the keyword in any field
                const filteredDocs = querySnapshot.docs.filter((doc) => {
                    const data = doc.data();
                    return Object.values(data).some(value => {
                        if (typeof value === 'string') {
                            return value.toLowerCase().includes(normalizedKeyword);
                        }
                        return false;
                    });
                });

                // Return an array of extracted data from the filtered documents
                return filteredDocs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            });

            // Use Promise.all to wait for all collections to be queried
            const collectionResults = await Promise.all(collectionPromises);

            // Flatten the array of arrays into a single array
            const contacts = [].concat(...collectionResults);

            return contacts;
        }

        // If no keyword is provided, fetch all contacts without keyword filtering
        const contactsSnapshot = await getDocs(contactsQuery);
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

const getLast20Collections = async () => {
    try {
        const collectionsQuery = query(
            collection(db, 'contacts'),
            orderBy('id', 'desc'),
            limit(20)
        );

        const collectionsSnapshot = await getDocs(collectionsQuery);
        const collections = collectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error);
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


const contactService = { addOrUpdateContact, getAllContacts, downloadCsv, downloadVcf, getLast20Collections }


export default contactService;
