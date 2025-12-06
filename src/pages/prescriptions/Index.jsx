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
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    const navigate = useNavigate();
    const { token } = useAuth();


    useEffect(() => {
        const fetchPrescriptions = async () => {
            const options = {
                method: "GET",
                url: "/prescriptions",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setPrescriptions(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        
        fetchPrescriptions();
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


    useEffect(() => {
        const fetchDiagnoses = async () => {
            const options = {
                method: "GET",
                url: "/diagnoses",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setDiagnoses(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDiagnoses();
    }, []);


    const onDeleteCallback = (id) => {
        toast.success("Prescription deleted successfully");
        setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
    };

    return (
        <>
        
        <Button asChild variant='outline'className='mb-4 mr-auto block'>
            <Link size='sm' to={`/prescriptions/create`}>Create New Prescription</Link>
        </Button>


        <Table>
            {prescriptions.length < 1 && <TableCaption>Loading Content <Spinner /></TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    prescriptions.map((prescription) => {
                        
                        const diagnosis = diagnoses.find(diagnosis => diagnosis.id === prescription.diagnosis_id);
                        const patient = patients.find(patient => patient.id === prescription.patient_id);
                        return (
                            <TableRow key={prescription.id}>
                                <TableCell>{patient ? `${patient.first_name} ${patient.last_name}` : <Spinner />}</TableCell>
                                <TableCell>{diagnosis ? `${diagnosis.condition}` : <Spinner />}</TableCell>
                                <TableCell>{prescription.medication}</TableCell>
                                <TableCell>{prescription.dosage}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                    <Button 
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                                    ><Eye /></Button>
                                    <Button 
                                        className="cursor-pointer hover:border-blue-500"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                                    ><Pencil /></Button>
                                    <DeleteBtn onDeleteCallback={onDeleteCallback} resource="prescriptions" id={prescription.id} />
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
