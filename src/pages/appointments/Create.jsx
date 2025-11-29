import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { email } from 'zod';

export default function Create() {
    const [form, setForm] = useState({
        appointment_date: "",
        doctor_id: "",
        patient_id: "",
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    
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


    const createAppointment = async () => {

        const options = {
            method: "POST",
            url: `/appointments`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/appointments', { state: { 
                type: 'success',
                message: `Appointment "${response.data.appointment_date}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
            console.log("ZOD ISSUES:", err.response?.data?.error?.issues);

        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createAppointment();
    };

  return (
    <>
        <h1>Create a new Appointment</h1>
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
                        <option key={doc.id} value={Number(doc.id)}>
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
                        <option key={pat.id} value={Number(pat.id)}>
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