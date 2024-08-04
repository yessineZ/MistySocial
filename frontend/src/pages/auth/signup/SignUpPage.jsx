import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../assets/X.jsx";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import {HandleGender} from './GenderCheckBox.jsx' ; 
import {useMutation} from '@tanstack/react-query'
import axios from 'axios' ;
import { toast } from "react-hot-toast";
const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
        gender : "" ,
	});

	let {mutate , isError , isPending , error} = useMutation({
		mutationFn : async({email , username , fullName , password,gender}) => {
			try{
				const res = await axios.post('/api/auth/signup',{
					email,
                    username,
                    fullName,
                    password,
					gender
				},{
					withCredentials : true,
				})
                 
				console.log(res.data) ; 
				console.log(res) ; 
                if(res.status === 201) {
					toast.success(res.data.message) ;
				 
				}else {
					toast.error(res.data.error) ;
					throw new Error(res.data.error) ; 

				}


			}catch(err){
				console.log(err.message) ; 
				toast.error(err.message)  ;

			}
			
		},
		
	})
	

	

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData) ; 
		console.log(formData);

	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value  });
		

	};

	

	

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white flex text-nowrap'>Join Misty App </h1>
					<label className='input input-bordered border-red-300 rounded flex items-center gap-2  hover:bg-slate-600 transition-all '>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap '>
						<label className='input input-bordered border-red-300 rounded flex items-center gap-2 flex-1 hover:bg-slate-600 transition-all '>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='border-red-300 input input-bordered rounded flex items-center font-bold gap-2 flex-1  hover:bg-slate-600 transition-all '>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input border-red-300 input-bordered rounded flex items-center gap-2 font-bold hover:bg-slate-600 transition-all '>
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
					<div>
						<HandleGender gender={formData} setGender={setFormData}/>
					</div>
					<button className='btn rounded-full btn-primary text-white text-bold text-md'>{isPending ? (
						<span className="loading loading-spinner "></span>) : "signUp"}
						</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;