import React from "react";
import { useFormik } from "formik";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import contactService from "../services/api"



const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required").min(10, "Phone Number must have at least 10 characters").max(10, "Phone Number must have max of 10 characters"),
    enquiry: Yup.string(),
});

export default function AddModalContact({ visible, setVisible, update, setUpdate }) {
    const formik = useFormik({
        initialValues: {
            name: "",
            phoneNumber: "",
            enquiry: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await contactService.addOrUpdateContact(
                    values.name,
                    values.phoneNumber,
                    values.enquiry
                );
                console.log(result);
                formik.resetForm();
                setUpdate(!update)
                setVisible(false);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });

    const headerElement = (
        <div className="text-center">
            <span className="font-bold text-3xl white-space-nowrap">Add Contact</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={() => setVisible(false)}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="card flex flex-column gap-3">
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                id="name"
                                name="name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                className="p-inputtext-lg"
                                placeholder="Name"
                            />
                        </div>
                        <small className="p-error">{formik.touched.name && formik.errors.name}</small>

                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-phone"></i>
                            </span>
                            <InputText
                                id="phoneNumber"
                                name="phoneNumber"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phoneNumber}
                                className="p-inputtext-lg"
                                placeholder="Phone Number"
                            />
                        </div>
                        <small className="p-error">{formik.touched.phoneNumber && formik.errors.phoneNumber}</small>

                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">!</span>
                            <InputText
                                id="enquiry"
                                name="enquiry"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.enquiry}
                                className="p-inputtext-lg"
                                placeholder="Any Requirements?"
                            />
                        </div>
                        <small className="p-error">{formik.touched.enquiry && formik.errors.enquiry}</small>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
