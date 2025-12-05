import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Show() {
    const [appointment, setAppointment] = useState([]);
    const [patient, setPatient] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchAppointment = async () => {
        const options = {
            method: "GET",
            url: `/appointments/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setAppointment(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchAppointment();
    }, []);

    useEffect(() => {
        if (!appointment.doctor_id) return;
        const fetchDoctor = async () => {
        const options = {
            method: "GET",
            url: `/doctors/${appointment.doctor_id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log("this is theeeee" + response.data);
            setDoctor(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDoctor();
    }, [appointment]);

    useEffect(() => {
        if (!appointment.patient_id) return;
        const fetchPatient = async () => {
        const options = {
            method: "GET",
            url: `/patients/${appointment.patient_id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log("this is theeeee" + response.data);
            setPatient(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchPatient();
    }, [appointment]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Dr. {doctor.first_name} {doctor.last_name} </CardTitle>
                <CardTitle>Dr. {patient.first_name} {patient.last_name} </CardTitle>
                <CardDescription>
                    Appointment on {new Date(appointment.appointment_date).toLocaleString()}
                </CardDescription>
            </CardHeader>
            <CardContent>

                <p className="text-sm text-muted-foreground">
                    Created: {new Date(appointment.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    Updated: {new Date(appointment.updatedAt).toLocaleString()}
                </p>

            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
}
