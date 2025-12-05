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
    const [diagnoses, setDiagnoses] = useState([]);
    const [patients, setPatients] = useState([]);

    const navigate = useNavigate();
    const token = useAuth();


    useEffect(() => {
        const fetchDiagnoses = async () => {
        const options = {
            method: "GET",
            url: "/diagnoses",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let response = await axios.request(options);
            console.log("diagnoses response.data isssss" + response.data);
            setDiagnoses(response.data);
        } catch (err) {
            console.log(err);
        }
        };

        fetchDiagnoses();
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
        toast.success("Diagnosis deleted successfully");
        setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
    };

    return (
        <>
        
        <Button asChild variant='outline'className='mb-4 mr-auto block'>
            <Link size='sm' to={`/diagnoses/create`}>Create New Diagnosis</Link>
        </Button>


        <Table>
            {diagnoses.length < 1 && <TableCaption>Loading Content <Spinner /></TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Diagnosis Date</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {diagnoses.map((diagnosis) => {
                    const patient = patients.find(patient => patient.id === diagnosis.patient_id);
                    return (
                    <TableRow key={diagnosis.id}>
                        <TableCell>{patient ? `${patient.first_name} ${patient.last_name}` : <Spinner />}</TableCell>
                        <TableCell>{diagnosis.condition}</TableCell>
                        <TableCell>{diagnosis.diagnosis_date}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                            <Button 
                                className="cursor-pointer hover:border-blue-500"
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                            ><Eye /></Button>
                            <Button 
                                className="cursor-pointer hover:border-blue-500"
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                            ><Pencil /></Button>
                            <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={diagnosis.id} />
                            </div>

                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </>
    );
}
