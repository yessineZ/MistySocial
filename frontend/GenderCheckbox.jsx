const GenderCheckbox = ({handleChecked,genderInput}) => {
	return (
		<div className='flex'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${genderInput === "Male" ? "selected" : ""}`}>
					<span className='label-text'>Male</span>
					<input onChange={() => handleChecked("Male")} checked={genderInput ==="Male"} type='checkbox' className='checkbox border-slate-900' />
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${genderInput === "Female" ? "selected" :""} `}>
					<span className='label-text '>Female</span>
					<input onChange={() => handleChecked("Female")} checked={genderInput ==="Female"} type='checkbox' className='checkbox border-slate-900 ' />
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;