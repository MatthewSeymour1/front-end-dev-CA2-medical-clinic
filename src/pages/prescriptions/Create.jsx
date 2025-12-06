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

export default function Create() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();
    const formSchema = z.object({
        patient_id: z.string().min(1, "Patient is required"),   
        doctor_id: z.string().min(1, "Doctor is required"),
        diagnosis_id: z.string().min(1, "Condition is required"),
        medication: z.string().min(1, "Medication is required"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.string().min(1, "Start Date is required"),
        end_date: z.string().min(1, "Start Date is required"),
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
    const patientSelected = form.watch("patient_id");

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
                console.log(response.data);
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
                console.log(response.data);
                setPatients(response.data);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchPatients();
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
                console.log(response.data);
                let diagnosesArray = response.data;
                let filteredArray = diagnosesArray.filter((diagnosis) => {
                    return Number(diagnosis.patient_id) === Number(patientSelected); 
                });
                setDiagnoses(filteredArray);
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchDiagnoses();
    }, [patientSelected]);


    const createPrescription = async (data) => {
        const options = {
            method: "POST",
            url: `/prescriptions`,
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
                message: `Prescription created successfully` 
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
        createPrescription(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Create a new Prescription</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-prescription-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">

                        <Controller 
                            name="patient_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Patient</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
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
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select Condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {diagnoses.map((diagnosis) => {
                                                return (
                                                    <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                                                        {diagnosis.condition}
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
                    form="create-prescription-form"
                    variant="outline"
                    type="submit"
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}