import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice"; // Kiểm tra đường dẫn này
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userApiSlice";

const Register = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    const userInfo = useSelector((state) => state.auth.userInfo);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp");
        } else {
            try {
                const res = await register({
                    name: username,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredentials({ ...res.metadata }));
                navigate(redirect);
                toast.success("Đăng kí thành công!");
            } catch (error) {
                console.log(error);
                toast.error(error.data?.message || "Registration failed");
            }
        }
    };
    return (
        <section className="pl-[10rem] flex flex-wrap">
            <div className="mr-[4rem] mt-[5rem]">
                <h1 className="text-2xl font-semibold mb-4">Đăng Kí</h1>
                <form onSubmit={submitHandler} className="container w-[40rem]">
                    <div className="my-[2rem]">
                        <label
                            htmlFor="name"
                            className="block text-sm text-black font-medium"
                        >
                            Tên
                        </label>

                        <input
                            type="name"
                            id="name"
                            name="name"
                            className="mt-1 p-2 block w-full rounded-md border-black text-black bg-gray-100"
                            placeholder="Nhập tên của bạn"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div className="my-[2rem]">
                        <label
                            htmlFor="email"
                            className="block text-sm text-black font-medium"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="mt-1 p-2 block w-full rounded-md border-black text-black bg-gray-100"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="my-[2rem]">
                        <label
                            htmlFor="password"
                            className="block text-sm text-black font-medium"
                        >
                            Mật khẩu
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 p-2 block w-full rounded-md border-black text-black bg-gray-100"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="my-[2rem]">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm text-black font-medium"
                        >
                            Xác nhận mật khẩu
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="mt-1 p-2 block w-full rounded-md border-black text-black bg-gray-100"
                            placeholder="Nhập mật khẩu của bạn"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`bg-pink-500 text-white px-4 py-2 rounded my-[1rem] ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {isLoading ? "Đang đăng kí..." : "Đăng kí"}
                    </button>

                    {isLoading && <Loader />}
                </form>

                <div className="mt-4">
                    <p className="text-black">
                        Đã có tài khoản?{" "}
                        <Link
                            to={
                                redirect
                                    ? `/login?redirect=${redirect}`
                                    : "/login"
                            }
                            className="text-pink-500 hover:underline"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
            <img
                src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                alt=""
                className="h-[65rem] w-[47%] xl:block md:hidden sm:hidden rounded-lg"
            />
        </section>
    );
};

export default Register;
