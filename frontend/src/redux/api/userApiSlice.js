import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        profile: builder.mutation({
            query: (data) => {
                const token = localStorage.getItem("token");
                return {
                    url: `${USERS_URL}/updateme`,
                    method: "PATCH",
                    body: data,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                };
            },
        }),
        getUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}/getAllUsers`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                method: "DELETE",
            }),
        }),
        getUserDetails: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserDetailsQuery,
} = userApiSlice;
