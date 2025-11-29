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
    const [doctor, setDoctor] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();

    useEffect(() => {
        const fetchDoctor = async () => {
        const options = {
            method: "GET",
            url: `/doctors/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            setDoctor(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDoctor();
    }, []);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Dr. {doctor.first_name} {doctor.last_name} </CardTitle>
                <CardDescription>
                    {doctor.specialisation}
                </CardDescription>
            </CardHeader>
            <CardContent>

                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p className="text-sm text-muted-foreground">
                    Joined: {new Date(doctor.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                    Updated: {new Date(doctor.updatedAt).toLocaleString()}
                </p>

            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    );
}
