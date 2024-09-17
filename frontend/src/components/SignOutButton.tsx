import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
const SignOutButton = () => {
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken"); // invalidate token to clear user data
            showToast({message: "Sign Out Successful!", type: "SUCCESS"});

        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });
    const handleClick = () => {
        mutation.mutate();
    }
    return (
        <button onClick={handleClick} className="bg-white hover:bg-gray-300 text-blue-600 font-bold py-2 px-4 rounded">
            Sign Out
        </button>
    )
}
export default SignOutButton;