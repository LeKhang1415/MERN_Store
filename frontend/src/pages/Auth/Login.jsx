import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, { isLoading, error }] = useLoginMutation();
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

        try {
            const res = await login({ email, password }).unwrap();
            console.log(res);
            navigate(redirect);
            dispatch(setCredentials({ ...res.metadata }));
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
                    <form
                        onSubmit={submitHandler}
                        className="container w-[40rem]"
                    >
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

                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`bg-pink-500 text-white px-4 py-2 rounded my-[1rem] ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        {isLoading && <Loader />}
                    </form>

                    <div className="mt-4">
                        <p className="text-black">
                            Người dùng mới?{" "}
                            <Link
                                to={
                                    redirect
                                        ? `/register?redirect=${redirect}`
                                        : "/register"
                                }
                                className="text-pink-500 hover:underline"
                            >
                                Đăng kí
                            </Link>
                        </p>
                    </div>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                    alt=""
                    className="h-[65rem] w-[47%] xl:block md:hidden sm:hidden rounded-lg"
                />
            </section>
        </div>
    );
};

export default Login;
