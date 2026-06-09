'use client';

import { motion } from 'motion/react';
import { toast } from 'sonner';
import { IconBolt, IconLoader2, IconCornerUpLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';

interface CheckEmailViewProps {
	email: string;
	otpValue: string;
	isLoading: boolean;
	onOtpChange: (value: string) => void;
	onResend: () => void;
	onBack: () => void;
}

export const CheckEmailView = ({
	email,
	otpValue,
	isLoading,
	onOtpChange,
	onResend,
	onBack,
}: CheckEmailViewProps) => {
	const handleOtpChange = (val: string) => {
		onOtpChange(val);
		if (val.length === 6) {
			toast.success('Verifying code…');
		}
	};

	return (
		<motion.div
			key="check-email"
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			transition={{ duration: 0.25 }}
			className="flex flex-col items-center text-center"
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					delay: 0.1,
					duration: 0.3,
					ease: 'easeOut' as const,
				}}
				className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-5"
			>
				<IconBolt className="h-7 w-7 text-primary" />
			</motion.div>

			<h2 className="text-xl font-semibold tracking-tight">
				Check your email
			</h2>
			<p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[280px]">
				Enter the code sent to{' '}
				<span className="font-medium text-foreground">{email}</span>
			</p>

			<div className="mt-7 flex flex-col items-center gap-4">
				<InputOTP
					maxLength={6}
					value={otpValue}
					onChange={handleOtpChange}
				>
					<InputOTPGroup className="gap-2">
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<InputOTPSlot
								key={i}
								index={i}
								className="h-12 w-10 text-lg font-medium border-input rounded-lg"
							/>
						))}
					</InputOTPGroup>
				</InputOTP>

				<p className="text-xs text-muted-foreground">
					Can&apos;t find the email? Check your spam folder.
				</p>
			</div>

			<div className="mt-7 w-full space-y-2">
				<Button
					onClick={onResend}
					disabled={isLoading}
					className="w-full h-10"
				>
					{isLoading ? (
						<IconLoader2 className="h-4 w-4 animate-spin" />
					) : (
						'Resend email code'
					)}
				</Button>
				<Button
					variant="ghost"
					onClick={onBack}
					className="w-full h-9 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"
				>
					<IconCornerUpLeft className="h-3.5 w-3.5" />
					Back
				</Button>
			</div>
		</motion.div>
	);
};
