import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
        if (!success) return;
        setLoading(true)
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender })
            })

            const data = await res.json();

            // console.log(data)

            if (data.error) {
                throw new Error(data.error)
            }

            //We will store data in local storage so that when we refresh it will not be lost
            localStorage.setItem("chat-user", JSON.stringify(data));

            //Context
            setAuthUser(data);
            toast.success("User signed Up successfully!")

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    }
    return { loading, signup }
}

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill out all the fields!");
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match!")
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must be of at least 6 characters!")
        return false
    }
    return true;
}
