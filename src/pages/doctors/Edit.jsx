import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

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
import { useParams } from "react-router";
import { useEffect } from "react";

export default function Edit() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const formSchema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        phone: z.string().min(1, "Phone is required").max(11, "Phone number is too long"),
        email: z.string().email("Invalid email address"),
        specialisation: z.enum([
            "Podiatrist", 
            "Dermatologist", 
            "Pediatrician", 
            "Psychiatrist", 
            "General Practitioner",
        ]),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            specialisation: "",
        },
        mode: "onChange",
    });



    useEffect(() => {
        const fetchDoctor = async () => {
            const options = {
                method: "GET",
                url: `/doctors/${id}`,
                headers: {
                Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let doctor = response.data;
                form.reset({
                    first_name: doctor.first_name,
                    last_name: doctor.last_name,
                    phone: doctor.phone,
                    email: doctor.email,
                    specialisation: doctor.specialisation,
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchDoctor();
    }, []);



    const updateDoctor = async (data) => {

        const options = {
            method: "PATCH",
            url: `/doctors/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/doctors");
            } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (data) => {
        console.log(data);

        let formattedData = {
            ...data,
            phone: data.phone.replace(/\s+/g, ""),
        };
        console.log("Formatted Data");
        console.log(formattedData);
        updateDoctor(formattedData);
    };

    return (
        <>
            <Card className="w-full max-w-md mt-4">
                <CardHeader>
                    <CardTitle>Edit a Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="edit-doctor-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                                name="specialisation"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Specialisation</FieldLabel>
                                        <Select
                                            name={field.name}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select Specialisation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Podiatrist">Podiatrist</SelectItem>
                                                <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                                                <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                                                <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                                <SelectItem value="General Practitioner">General Practitioner</SelectItem>
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
                        form="edit-doctor-form"
                        variant="outline" 
                        type="submit" 
                    >Submit</Button>
                </CardFooter>
            </Card>
        </>
    );
}
