import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
        // add regex here
        if (!options.email.includes('@')) {
            return [
                {
                    field: "email",
                    message: "invalid",
                },
            ];
        }
        if (options.username.length <= 2) {
            return [
                {
                    field: "username",
                    message: "length must be greater than 2",
                },
            ];
        }
        if (options.username.includes('@')) {
            return [
                {
                    field: "username",
                    message: "Your username cannot include an @ symbol",
                },
            ];
    }
        if (options.password.length <= 2) {
            return [
                {
                    field: "password",
                    message: "length must be greater than 2",
                },
            ];
        }

        return null;
};