import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { IconCalendarWeek } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Create() {

    const navigate = useNavigate();
    const { token } = useAuth();
    const [patients, setPatients] = useState([]);
    const formSchema = z.object({
        condition: z.string().min(1, "First name is required"),
        diagnosis_date: z.string().min(1, "Last name is required"),
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

    const createDiagnosis = async (data) => {

        const options = {
            method: "POST",
            url: `/diagnoses`,
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
                message: `Diagnosis "${response.data.condition}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
            console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
        }
    };

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

    const handleSubmit = (data) => {
        console.log(data);

        let formattedData = {
            ...data,
            patient_id: Number(data.patient_id),
            diagnosis_date: new Date(data.diagnosis_date).toISOString().split("T")[0],
        };
        console.log("Formatted Data");
        console.log(formattedData);
        createDiagnosis(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Create a new Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-diagnosis-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                    form="create-diagnosis-form"
                    variant="outline"
                    type="submit"
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}