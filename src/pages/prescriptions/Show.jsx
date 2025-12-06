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
    const [prescription, setPrescription] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [patient, setPatient] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchPrescription = async () => {
        const options = {
            method: "GET",
            url: `/prescriptions/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setPrescription(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchPrescription();
    }, []);

    useEffect(() => {
        if (!prescription.diagnosis_id) return;
        const fetchDiagnosis = async () => {
        const options = {
            method: "GET",
            url: `/diagnoses/${prescription.diagnosis_id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            setDiagnosis(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDiagnosis();
    }, [prescription]);

    useEffect(() => {
        if (!prescription.doctor_id) return;
        const fetchDoctor = async () => {
        const options = {
            method: "GET",
            url: `/doctors/${prescription.doctor_id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            setDoctor(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDoctor();
    }, [prescription]);

    useEffect(() => {
        if (!prescription.patient_id) return;
        const fetchPatient = async () => {
        const options = {
            method: "GET",
            url: `/patients/${prescription.patient_id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            setPatient(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchPatient();
    }, [prescription]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{patient.first_name} {patient.last_name} </CardTitle>
            </CardHeader>
            <CardContent>

                
                <p><strong>Prescribing Doctor:</strong> Dr {doctor.first_name} {doctor.last_name}</p>
                <p><strong>Condition:</strong> {diagnosis.condition}</p>
                <p><strong>Medication:</strong> {prescription.medication}</p>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Start Date:</strong> {new Date(prescription.start_date).toLocaleString()}</p>
                <p><strong>End Date:</strong> {new Date(prescription.end_date).toLocaleString()}</p>

                <p className="text-sm text-muted-foreground">
                    Created: {new Date(prescription.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    Updated: {new Date(prescription.updatedAt).toLocaleString()}
                </p>

            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
}
