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
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const formSchema = z.object({
        condition: z.string().min(1, "Condition is required"),
        diagnosis_date: z.string().min(1, "You must pick a date"),
        patient_id: z.string().min(1, "Patient is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            condition: "",
            diagnosis_date: "",
            patient_id: "",
        },
        mode: "onChange",
    });



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
    useEffect(() => {
        const fetchDiagnosis = async () => {
            const options = {
                method: "GET",
                url: `/diagnoses/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let diagnosis = response.data;
                form.reset({
                    condition: diagnosis.condition,
                    diagnosis_date: new Date (diagnosis.diagnosis_date).toISOString().split("T")[0],
                    patient_id: String(diagnosis.patient_id),
                });
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchDiagnosis();
    }, []);

    const updateDiagnosis = async (data) => {
        const options = {
            method: "PATCH",
            url: `/diagnoses/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data,
        };


        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/diagnoses', { state: { 
                type: 'success',
                message: `Diagnosis updated successfully` 
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
            patient_id: Number(data.patient_id),
        }
        console.log("Formatted Data");
        console.log(formattedData);
        updateDiagnosis(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Edit an Appointment</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="update-appointment-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">

                        <Controller 
                            name="condition"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Condition</FieldLabel>
                                    <Input
                                        id="condition"
                                        {...field}
                                        placeholder="Condition"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="diagnosis_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Diagnosis Date</FieldLabel>

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


                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full cursor-pointer"
                    form="update-appointment-form"
                    variant="outline"
                    type="submit"
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}