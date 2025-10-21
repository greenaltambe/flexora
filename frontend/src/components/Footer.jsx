import { Dumbbell, Target, Users, Mail } from "lucide-react";

const Footer = () => {
	return (
		<div>
			<footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
				<div className="grid grid-flow-col gap-4">
					<div className="flex items-center gap-2">
						<Dumbbell className="w-6 h-6 text-primary" />
						<span className="text-xl font-bold">Flexora</span>
					</div>
				</div>
				<div className="grid grid-flow-col gap-4">
					<a className="link link-hover flex items-center gap-2">
						<Target className="w-4 h-4" />
						Workout Plans
					</a>
					<a className="link link-hover flex items-center gap-2">
						<Users className="w-4 h-4" />
						Community
					</a>
					<a className="link link-hover flex items-center gap-2">
						<Mail className="w-4 h-4" />
						Contact
					</a>
				</div>
				<div>
					<p className="font-bold">
						Flexora - Your Personal Fitness Journey
						<br />
						Providing workout plans since 2024
					</p>
					<p>Copyright © 2024 - All right reserved by Flexora</p>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
