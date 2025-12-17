import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
    const { onRegister } = useAuth();

    const formSchema = z.object({
        first_name: z.string().min(1, "First name is required").max(15),
        last_name: z.string().min(1, "Last name is required").max(15),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const handleSubmit = async (data) => {
        try {
            await onRegister(data.first_name, data.last_name, data.email, data.password);
        } catch (err) {
            console.log("Registration error:", err);
        }
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Register an account</CardTitle>
                <CardDescription>Enter your details below to register</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="register-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        id="register_email"
                                        {...field}
                                        placeholder="Email"
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        id="register_password"
                                        {...field}
                                        placeholder="Password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                    />

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
                <Button type="submit" form="register-form" variant="outline" className="w-full">
                    Register
                </Button>
            </CardFooter>
        </Card>
    );
}
