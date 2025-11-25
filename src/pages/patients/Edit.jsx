import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        date_of_birth: "",
    });

    const { token } = useAuth();

    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let patient = response.data;
                setForm({
                    first_name: patient.first_name,
                    last_name: patient.last_name,
                    phone: patient.phone.replace(/\s+/g, ""),
                    email: patient.email,
                    address: patient.address,
                    date_of_birth: new Date(patient.date_of_birth * 1000).toISOString().split("T")[0],
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatient();
    }, []);

    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const updatePatient = async () => {

        const options = {
            method: "PATCH",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/patients");
            } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        updatePatient();
    };

    return (
        <>
            <h1>Update Patient</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    placeholder="First Name" 
                    name="first_name" 
                    value={form.first_name} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Last Name" 
                    name="last_name" 
                    value={form.last_name} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Phone" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Address" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange}
                />
                <Input 
                    className="mt-2"
                    type="text" 
                    placeholder="Date of Birth" 
                    name="date_of_birth" 
                    value={form.date_of_birth} 
                    onChange={handleChange}
                />
                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
                Submit
                </Button>
            </form>
        </>
    );
}
