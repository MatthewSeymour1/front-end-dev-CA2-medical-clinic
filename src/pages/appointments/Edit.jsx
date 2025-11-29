import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
    const [form, setForm] = useState({
        appointment_date: "",
        doctor_id: "",
        patient_id: "",
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchAppointment = async () => {
            const options = {
                method: "GET",
                url: `/appointments/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let appointment = response.data;
                setForm({
                    appointment_date: appointment.appointment_date,
                    doctor_id: appointment.doctor_id,
                    patient_id: appointment.patient_id,
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointment();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
        const options = {
            method: "GET",
            url: "/doctors",
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setDoctors(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDoctors();
    }, []);


    useEffect(() => {
        const fetchPatients = async () => {
        const options = {
            method: "GET",
            url: "/patients",
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setPatients(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchPatients();
    }, []);



    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const updateAppointment = async () => {

        const options = {
            method: "PATCH",
            url: `/appointments/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/appointments");
            } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        updateAppointment();
    };

    return (
        <>
            <h1>Update Appointment</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    placeholder="Appointment Date" 
                    name="appointment_date" 
                    value={form.appointment_date} 
                    onChange={handleChange} 
                />
                <select
                    name="doctor_id"
                    value={form.doctor_id}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border p-2"
                >
                <option value="" disabled hidden>Doctor</option>
                {
                    doctors.map((doc) => {
                        return (
                            <option key={doc.id} value={doc.id}>
                                Dr. {doc.first_name} {doc.last_name}
                            </option>
                        )
                    })
                }

                </select>
                <select 
                    name="patient_id" 
                    value={form.patient_id} 
                    onChange={handleChange} 
                    className="mt-2 w-full rounded-md border p-2"
                >
                <option value="" disabled hidden>Patient</option>
                {
                    patients.map((pat) => {
                        return (
                            <option key={pat.id} value={pat.id}>
                                Dr. {pat.first_name} {pat.last_name}
                            </option>
                        )
                    })
                }

                </select>
                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
                Submit
                </Button>
            </form>
        </>
    );
}
