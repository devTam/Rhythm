import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is required!").min(3, "Name is too short!"),
    email: yup.string().required("Email is required!").email("Invalid Email!"),
    password: yup.string().trim().required("Password is required!").min(8, "Password must be min 8 characters long!").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
});