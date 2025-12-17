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
import { useEffect } from "react";

export default function Edit() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const formSchema = z.object({
        first_name: z.string().min(1, "First name is required").max(15, "First name is too long"),
        last_name: z.string().min(1, "Last name is required").max(15, "Last name is too long"),
        phone: z.string().min(10, "Phone is required").max(10, "Phone number is too long"),
        email: z.string().email("Invalid email address"),
        address: z.string().min(1, "Address is required"),
        date_of_birth: z.string().min(1, "Date of Birth is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            address: "",
            date_of_birth: "",
        },
        mode: "onChange",
    });



    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let patient = response.data;
                form.reset({
                    first_name: patient.first_name,
                    last_name: patient.last_name,
                    phone: patient.phone,
                    email: patient.email,
                    address: patient.address,
                    date_of_birth: new Date (patient.date_of_birth).toISOString().split("T")[0],
                });
            } catch (err) {
                console.log(err);
                console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
            }
        };

        fetchPatient();
    }, []);



    const updatePatient = async (data) => {

        const options = {
            method: "PATCH",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/patients");
            } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (data) => {
        console.log(data);

        let formattedData = {
            ...data,
            phone: data.phone.replace(/\s+/g, ""),
            date_of_birth: new Date(data.date_of_birth).toISOString().split("T")[0],
        };
        console.log("Formatted Data");
        console.log(formattedData);
        updatePatient(formattedData);
    };

    return (
        <>
            <Card className="w-full max-w-md mt-4">
                <CardHeader>
                    <CardTitle>Create a new Patient</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="edit-patient-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">
                        <Controller 
                            name="first_name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>First Name</FieldLabel>
                                    <Input
                                        id="first_name"
                                        {...field}
                                        placeholder="First Name"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="last_name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Last Name</FieldLabel>
                                    <Input
                                        id="last_name"
                                        {...field}
                                        placeholder="Last Name"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Phone Number</FieldLabel>
                                    <Input
                                        id="phone"
                                        {...field}
                                        placeholder="Phone Number"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        id="email"
                                        {...field}
                                        placeholder="Email"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Address</FieldLabel>
                                    <Input
                                        id="address"
                                        {...field}
                                        placeholder="Address"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="date_of_birth"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Date of Birth</FieldLabel>

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
                                                        field.onChange(date.toISOString().split("T")[0]); // store as string
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
                        form="edit-patient-form"
                        variant="outline" 
                        type="submit" 
                    >Submit</Button>
                </CardFooter>
            </Card>
        </>
    );
}
