import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
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
import { Spinner } from "@/components/ui/spinner";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

export default function Index() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const navigate = useNavigate();
    const { token } = useAuth();


    useEffect(() => {
        const fetchAppointments = async () => {
            const options = {
                method: "GET",
                url: "/appointments",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            try {
                let response = await axios.request(options);
                const sortedAppointments = response.data.sort((a, b) => a.appointment_date - b.appointment_date);
                console.log(response.data);
                setAppointments(sortedAppointments);
            } catch (err) {
                console.log(err);
            }
        };

        
        fetchAppointments();
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





    const onDeleteCallback = (id) => {
        toast.success("Appointment deleted successfully");
        setAppointments(appointments.filter(appointment => appointment.id !== id));
    };

    return (
        <>
        
        <Button asChild variant='outline'className='mb-4 mr-auto block'>
            <Link size='sm' to={`/appointments/create`}>Create New Appointment</Link>
        </Button>


        <Table>
            {appointments.length < 1 && <TableCaption>Loading Content <Spinner /></TableCaption>}
            <TableHeader>
                <TableRow>
                <TableHead>Appointment Date</TableHead>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    appointments.map((app) => {
                        
                        const doctor = doctors.find(doctor => doctor.id === app.doctor_id);
                        const patient = patients.find(patient => patient.id === app.patient_id);
                        return (
                            <TableRow key={app.id}>
                                <TableCell>{new Date(app.appointment_date * 1000).toLocaleString()}</TableCell>
                                <TableCell>{doctor ? `Dr ${doctor.first_name} ${doctor.last_name}` : <Spinner />}</TableCell>
                                <TableCell>{patient ? `${patient.first_name} ${patient.last_name}` : <Spinner />}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                    <Button 
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/appointments/${app.id}`)}
                                    ><Eye /></Button>
                                    <Button 
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/appointments/${app.id}/edit`)}
                                    ><Pencil /></Button>
                                    <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={app.id} />
                                    </div>

                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
        </>
    );
}
