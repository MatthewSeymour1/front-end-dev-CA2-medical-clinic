import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { Link } from 'react-router';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Appointment() {
    const [patient, setPatient] = useState([]);
    const [appointment, setAppointment] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchPatient = async () => {
        const options = {
            method: "GET",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setPatient(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchPatient();
    }, []);



    useEffect(() => {
        const fetchAppointment = async () => {
        const options = {
            method: "GET",
            url: `/patients/${id}/appointments`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);

            const sortedAppointments = response.data.sort((a, b) => a.appointment_date - b.appointment_date);
            console.log(response.data);
            setAppointment(sortedAppointments);
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






    return (
<div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">
                {patient.first_name} {patient.last_name}'s Appointments
            </h1>

            {appointment.map((app) => {
                const doctor = doctors.find(doctor => doctor.id === app.doctor_id);
                return (
                <Card key={app.id} className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Appointment ID: {app.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p>Date: {new Date(app.appointment_date * 1000).toLocaleString()}</p>
                            <p>Dr. {doctor.first_name} {doctor.last_name}</p>
                            <p>Created At: {new Date(app.createdAt).toLocaleString()}</p>
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link to={`/patients/${patient.id}`}>Back to Patient</Link>
                        </Button>
                    </CardFooter>
                </Card>
                );
            })}
        </div>

    );
}
