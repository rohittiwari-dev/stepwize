'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
	IconUser,
	IconMail,
	IconLoader2,
	IconCheck,
	IconCamera,
} from '@tabler/icons-react';
import { useSession, updateUser } from '@/lib/auth/clients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Field,
	FieldLabel,
	FieldError,
	FieldDescription,
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';

/* ── Validation ── */

const profileSchema = z.object({
	name: z.string().min(1, 'Display name is required'),
	image: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/* ── Helpers ── */

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((w) => w[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/* ── Component ── */

const ProfileForm = () => {
	const { data: session, isPending } = useSession();
	const [isSaving, setIsSaving] = useState(false);

	const user = session?.user;

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		values: {
			name: user?.name ?? '',
			image: user?.image ?? '',
		},
		mode: 'onTouched',
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = form;

	const onSubmit = async (values: ProfileFormValues) => {
		setIsSaving(true);
		try {
			const { error } = await updateUser({
				name: values.name,
				image: values.image || undefined,
			});

			if (error) {
				toast.error(error.message || 'Failed to update profile.');
			} else {
				toast.success('Profile updated successfully!');
				form.reset(values);
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isPending) {
		return <ProfileFormSkeleton />;
	}

	if (!user) {
		return null;
	}

	const initials = getInitials(user.name ?? 'U');

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* Avatar + Name preview */}
			<div className="flex items-center gap-5">
				<div className="group/avatar-wrap relative">
					<Avatar className="size-20 rounded-xl border-2 border-border/50 shadow-sm">
						<AvatarImage
							src={user.image ?? undefined}
							alt={user.name ?? ''}
							referrerPolicy="no-referrer"
							className="rounded-xl"
						/>
						<AvatarFallback className="rounded-xl bg-primary/10 text-lg font-semibold text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover/avatar-wrap:opacity-100">
						<IconCamera className="size-5 text-white" />
					</div>
				</div>
				<div className="space-y-1">
					<h3 className="text-base font-semibold text-foreground">
						{user.name}
					</h3>
					<p className="text-sm text-muted-foreground">{user.email}</p>
					{user.emailVerified && (
						<span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
							<IconCheck className="size-3" />
							Email verified
						</span>
					)}
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-border/50" />

			{/* Form fields */}
			<div className="space-y-5">
				{/* Name */}
				<Field data-invalid={!!errors.name}>
					<FieldLabel htmlFor="profile-name">Display Name</FieldLabel>
					<div className="relative">
						<Input
							id="profile-name"
							placeholder="Your display name"
							className="peer h-10 bg-background pl-9"
							aria-invalid={!!errors.name}
							autoComplete="name"
							{...register('name')}
						/>
						<IconUser className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
					</div>
					{errors.name && <FieldError errors={[errors.name]} />}
				</Field>

				{/* Email (read-only — changeEmail requires verification flow) */}
				<Field>
					<FieldLabel htmlFor="profile-email">Email Address</FieldLabel>
					<div className="relative">
						<Input
							id="profile-email"
							type="email"
							value={user.email}
							className="h-10 bg-muted/30 pl-9 opacity-70"
							disabled
						/>
						<IconMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					</div>
					<FieldDescription>
						Email changes require a verification step. Contact support if
						you need to change your email.
					</FieldDescription>
				</Field>

				{/* Avatar URL */}
				<Field data-invalid={!!errors.image}>
					<FieldLabel htmlFor="profile-image">Avatar URL</FieldLabel>
					<Input
						id="profile-image"
						type="url"
						placeholder="https://example.com/avatar.jpg"
						className="h-10 bg-background"
						aria-invalid={!!errors.image}
						{...register('image')}
					/>
					{errors.image && <FieldError errors={[errors.image]} />}
					<FieldDescription>
						Paste a direct URL to your avatar image, or leave blank to use
						initials.
					</FieldDescription>
				</Field>
			</div>

			{/* Save button */}
			<div className="flex items-center justify-end gap-3 pt-2">
				<Button
					type="button"
					variant="ghost"
					disabled={!isDirty || isSaving}
					onClick={() => form.reset()}
					className="text-muted-foreground"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={!isDirty || isSaving}
					className="min-w-[120px] shadow-neon"
				>
					{isSaving ? (
						<IconLoader2 className="size-4 animate-spin" />
					) : (
						'Save changes'
					)}
				</Button>
			</div>
		</form>
	);
};

/* ── Skeleton ── */

const ProfileFormSkeleton = () => (
	<div className="space-y-8">
		<div className="flex items-center gap-5">
			<Skeleton className="size-20 rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-5 w-36" />
				<Skeleton className="h-4 w-48" />
			</div>
		</div>
		<div className="h-px bg-border/50" />
		<div className="space-y-5">
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-10 w-full rounded-lg" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-10 w-full rounded-lg" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-10 w-full rounded-lg" />
			</div>
		</div>
	</div>
);

export default ProfileForm;
