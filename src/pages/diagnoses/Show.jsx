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

export default function Show() {
    const [patient, setPatient] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchDiagnosis = async () => {
            const options = {
                method: "GET",
                url: `/diagnoses/${id}`,
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
    }, []);

    useEffect(() => {
        if (!diagnosis?.patient_id) return;
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${diagnosis.patient_id}`,
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
    }, [diagnosis]);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{patient.first_name} {patient.last_name} </CardTitle>
                <CardDescription>
                    
                </CardDescription>
            </CardHeader>
            <CardContent>

                <p><strong>Condition:</strong> {diagnosis.condition}</p>
                <p><strong>Diagnosis Date:</strong> {new Date(diagnosis.diagnosis_date).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                    Joined: {new Date(diagnosis.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    Updated: {new Date(diagnosis.updatedAt).toLocaleString()}
                </p>


            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link to={`/diagnoses`}>Back to Diagnoses</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
