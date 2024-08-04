export const HandleGender = ({gender,setGender}) => {
    return (
        <div className="flex flex-row ">
            <div className="m-2 flex gap-3">
                <label htmlFor="male"  className="text-xl font-bold">Male</label>
                <input checked={gender.gender==="Male"} id="male" className ="checkbox checkbox-warning " type="checkbox" name="gender" onChange={() => setGender({...gender,gender : "Male"})}/>
            </div>
            <div className="m-2 flex gap-3">
                <label htmlFor="female" className="text-xl font-bold">Female</label>
                <input id="female" checked={gender.gender==="Female"} className="checkbox checkbox-warning" type="checkbox" name="gender" onChange={() => setGender({...gender,gender : "Female"})}/>
            </div>
        </div>
    )
}