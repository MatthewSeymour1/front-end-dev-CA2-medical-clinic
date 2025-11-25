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

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{patient.first_name} {patient.last_name} </CardTitle>
                <CardDescription>
                    
                </CardDescription>
            </CardHeader>
            <CardContent>

                <p><strong>Phone:</strong> {patient.phone}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>Date of Birth:</strong> {new Date(patient.date_of_birth * 1000).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">
                    Joined: {new Date(patient.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    Updated: {new Date(patient.updatedAt).toLocaleString()}
                </p>


            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link to={`/patients/${patient.id}/appointments`}>View Appointments</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
