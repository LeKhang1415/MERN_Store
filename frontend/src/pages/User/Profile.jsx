import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

function Profile() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] =
        useProfileMutation();

    useEffect(() => {
        setUserName(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.username]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp");
        } else {
            try {
                const res = await updateProfile({
                    name: username,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...userInfo, ...res.metadata }));
                toast.success("Cập nhật thành công");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 mt-[5rem]">
            <div className="flex justify-center align-center md:flex md:space-x-4">
                <div className="md:w-1/3">
                    <h2 className="text-2xl font-semibold mb-4">
                        Câp nhật tài khoản
                    </h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-black mb-2">Tên</label>
                            <input
                                type="text"
                                placeholder="Nhập tên"
                                className="form-input p-4 rounded-sm w-full bg-gray-100"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-black mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Nhập email"
                                className="form-input p-4 rounded-sm w-full bg-gray-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-black mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className="form-input p-4 rounded-sm w-full bg-gray-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-black mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="form-input p-4 rounded-sm w-full bg-gray-100"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                            >
                                Cập nhật
                            </button>

                            <Link
                                to="/user-orders"
                                className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
                            >
                                My Orders
                            </Link>
                        </div>
                    </form>
                </div>
                {loadingUpdateProfile && <Loader />}
            </div>
        </div>
    );
}

export default Profile;
