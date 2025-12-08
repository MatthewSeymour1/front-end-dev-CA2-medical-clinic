import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar"
import { IconCalendarWeek } from "@tabler/icons-react";

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
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export default function Edit() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [prescription, setPrescription] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [patientSelected, setPatientSelected] = useState("");
    const navigate = useNavigate();
    const { token } = useAuth();
    const { id } = useParams();
    const formSchema = z.object({
        patient_id: z.string().min(1, "Patient is required"),   
        doctor_id: z.string().min(1, "Doctor is required"),
        diagnosis_id: z.string().min(1, "Condition is required"),
        medication: z.string().min(1, "Medication is required"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.string().min(1, "Start Date is required"),
        end_date: z.string().min(1, "End Date is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patient_id: "",   
            doctor_id: "",
            diagnosis_id: "",
            medication: "",
            dosage: "",
            start_date: "",
            end_date: "",
        },
        mode: "onChange",
    });

    // Fetch Doctors for Select Options
    useEffect(() => {
        const fetchDoctors = async () => {
            const options = {
                method: "GET",
                url: "/doctors",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                // console.log(response.data);
                setDoctors(response.data);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }

        };

        fetchDoctors();
    }, []);

    // Fetch Patients for Select Options
    useEffect(() => {
        const fetchPatients = async () => {
            const options = {
                method: "GET",
                url: `/patients`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                // console.log(response.data);
                console.log("THE PATIENT ID IS HOPEFULLY 107:");
                console.log(response.data);
                setPatients(response.data);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchPatients();
    }, []);

    // Fetch Prescription Data to pre-set the form with the data.
    useEffect(() => {
        const fetchPrescription = async () => {
            const options = {
                method: "GET",
                url: `/prescriptions/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                // if (!doctors.length || !diagnoses.length) return;
                let response = await axios.request(options);
                // console.log(response.data);
                let prescription = response.data;
                setPrescription(prescription);
                setPatientSelected(String(prescription.patient_id));

                form.reset({
                    patient_id: String(prescription.patient_id),   
                    doctor_id: String(prescription.doctor_id),
                    diagnosis_id: String(prescription.diagnosis_id),
                    medication: prescription.medication,
                    dosage: prescription.dosage,
                    start_date: new Date(prescription.start_date).toISOString().split("T")[0],
                    end_date: new Date(prescription.end_date).toISOString().split("T")[0],
                });

            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchPrescription();
    }, []);

    // Fetch Diagnosis data, specifically for the Condition. For the Select Options. but will need have the options be only the conditions that the selected patient has been diagnosed with.
    useEffect(() => {
        const fetchDiagnoses = async () => {
            const options = {
                method: "GET",
                url: `/diagnoses`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                // console.log(response.data);
                let diagnosesArray = response.data;
                let filteredArray = diagnosesArray.filter((diagnosis) => {
                    if (Number(diagnosis.patient_id) === Number(prescription.patient_id)) {
                        console.log("Diagnosis patient id:");
                        console.log(diagnosis.patient_id);
                        console.log("Selected Prescription patient id:");
                        console.log(prescription.patient_id);
                    }
                    return Number(diagnosis.patient_id) === Number(prescription.patient_id); 
                });
                // console.log(filteredArray);
                // console.log(prescription.id);
                setDiagnoses(filteredArray);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchDiagnoses();
    }, [patientSelected]);

    // Fetch single Diagnosis to pre-set the Condition select field.
    useEffect(() => {
        if (!prescription.diagnosis_id) return;
        const fetchDiagnosis = async () => {
            const options = {
                method: "GET",
                url: `/diagnoses/${prescription.diagnosis_id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log("single diagnosissssuuuuu areee");
                console.log(response.data);
                setDiagnosis(response.data);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchDiagnosis();
    }, [prescription]);

    const updatePrescription = async (data) => {
        const options = {
            method: "PATCH",
            url: `/prescriptions/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/prescriptions', { state: { 
                type: 'success',
                message: `Prescription updated successfully` 
            }});
        } catch (err) {
            console.log(err);
            console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
        }
    };


    const handleSubmit = (data) => {
        console.log(data);
        let formattedData = {
            ...data,
            doctor_id: Number(data.doctor_id),
            patient_id: Number(data.patient_id),
            diagnosis_id: Number(data.diagnosis_id),
            start_date: new Date(data.start_date).toISOString().split("T")[0],
            end_date: new Date(data.end_date).toISOString().split("T")[0],
        }
        console.log("Formatted Data");
        console.log(formattedData);
        updatePrescription(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Update Prescription</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="update-prescription-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">

                        <Controller 
                            name="patient_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Patient</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setPatientSelected(value);
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select Patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map((patient) => {
                                                return (
                                                    <SelectItem key={patient.id} value={String(patient.id)}>
                                                        {patient.first_name} {patient.last_name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                        <Controller 
                            name="doctor_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Doctor</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select Doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((doc) => {
                                                return (
                                                    <SelectItem key={doc.id} value={String(doc.id)}>
                                                        Dr. {doc.first_name} {doc.last_name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="diagnosis_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Condition</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            console.log(value);
                                            console.log("diagnosis is");
                                            console.log(diagnosis);
                                            console.log("diagnoses are");
                                            console.log(diagnoses);
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                                                {diagnosis.condition}
                                            </SelectItem>
                                            {diagnoses.map((singularDiagnosis) => {
                                                return (
                                                    <SelectItem key={singularDiagnosis.id} value={String(singularDiagnosis.id)}>
                                                        {singularDiagnosis.condition}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="medication"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Medication</FieldLabel>
                                    <Input
                                        id="medication"
                                        {...field}
                                        placeholder="Medication"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="dosage"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Dosage</FieldLabel>
                                    <Input
                                        id="dosage"
                                        {...field}
                                        placeholder="Dosage"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="start_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Start Date</FieldLabel>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-[280px] justify-between text-left font-normal;"
                                            >
                                                {field.value ? field.value : <span className="text-muted-foreground">Pick a date</span>}
                                                <IconCalendarWeek />

                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(date.toISOString().split("T")[0]);
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="end_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>End Date</FieldLabel>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-[280px] justify-between text-left font-normal;"
                                            >
                                                {field.value ? field.value : <span className="text-muted-foreground">Pick a date</span>}
                                                <IconCalendarWeek />

                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(date.toISOString().split("T")[0]);
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full cursor-pointer"
                    form="update-prescription-form"
                    variant="outline"
                    type="submit"
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}