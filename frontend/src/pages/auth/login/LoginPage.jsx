import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../assets/X.jsx" ; 

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import {useMutation , useQueryClient} from '@tanstack/react-query' ;
import { toast } from "react-hot-toast";
import axios from "axios";


const LoginPage = () => {
	const [formData, setFormData] = useState({
	email: "",
		password: "",
	});
	const queryClient = useQueryClient() ; 


	const {mutate, isError , isPending , error} = useMutation({
		mutationFn : async ({email,password}) => {
			try {
				const res = await axios.post('api/auth/login',{
					email,
					password
				},{
					withCredentials: true,
				});
				console.log(res) ; 
				if(res.data.user) {
					toast.success(res.data.message) ; 
					queryClient.invalidateQueries({queryKey : ['authUser']});
					
				}else {
					toast.error(res.data.error) ;
				}
				 

			}catch(error) {
				console.log(error.message) ; 
				toast.error(res.data.error) ; 
			}
		}
	})


	
  

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData) ; 
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? (<span className='loading loading-spinner'></span>) : 'Login'} 
					</button>
				
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;