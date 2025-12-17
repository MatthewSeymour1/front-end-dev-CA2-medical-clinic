import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function Index() {
    const [patients, setPatients] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();


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

    const onDeleteCallback = async (id) => {

        try {
            const authHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [appointmentsRes, prescriptionsRes, diagnosesRes] = await Promise.all([
                axios.get("/appointments", authHeaders),
                axios.get("/prescriptions", authHeaders),
                axios.get("/diagnoses", authHeaders),
            ]);

            const appointments = appointmentsRes.data.filter(
                appointment => Number(appointment.patient_id) === Number(id)
            );
            const prescriptions = prescriptionsRes.data.filter(
                prescription => Number(prescription.patient_id) === Number(id)
            );
            const diagnoses = diagnosesRes.data.filter(
                diagnosis => Number(diagnosis.patient_id) === Number(id)
            );

            await Promise.all(
                prescriptions.map(prescription => axios.delete(`/prescriptions/${prescription.id}`, authHeaders))
            )
            await Promise.all(
                appointments.map(appointment => axios.delete(`/appointments/${appointment.id}`, authHeaders))
            )
            await Promise.all(
                diagnoses.map(diagnosis => axios.delete(`/diagnoses/${diagnosis.id}`, authHeaders))
            )
    
            await axios.delete(`/patients/${id}`, authHeaders)
    
            setPatients(patients.filter(patient => patient.id !== id));
            toast.success("Patient deleted successfully");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to delete patient");
        }
    };

    return (
        <>
        
        <Button asChild variant='outline'className='mb-4 mr-auto block'>
            <Link size='sm' to={`/patients/create`}>Create New Patient</Link>
        </Button>


        <Table>
            {patients.length < 1 && <TableCaption>Loading Content <Spinner /></TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Number of Appointments</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.map((patient) => (
                    <TableRow key={patient.id}>
                        <TableCell>{patient.first_name + " " + patient.last_name}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{new Date (patient.date_of_birth * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>{patient.appointments.length}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                            <Button 
                                className="cursor-pointer hover:border-blue-500"
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(`/patients/${patient.id}`)}
                            ><Eye /></Button>
                            <Button 
                                className="cursor-pointer hover:border-blue-500"
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(`/patients/${patient.id}/edit`)}
                            ><Pencil /></Button>
                            <DeleteBtn onDeleteCallback={onDeleteCallback} resource="patients" id={patient.id} />
                            </div>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </>
    );
}
