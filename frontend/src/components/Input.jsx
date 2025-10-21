const Input = ({ icon: Icon, ...props }) => {
	return (
		<label className="input input-bordered flex items-center gap-2 w-full">
			{Icon && <Icon className="w-5 h-5 text-gray-500" />}
			<input
				type="text"
				className="grow outline-none bg-transparent"
				{...props}
			/>
		</label>
	);
};

export default Input;
