'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
	IconBuilding,
	IconWorld,
	IconLoader2,
	IconCheck,
	IconAlertCircle,
} from '@tabler/icons-react';
import { authClient } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Field,
	FieldLabel,
	FieldError,
	FieldDescription,
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* ── Validation ── */

const workspaceSchema = z.object({
	name: z.string().min(1, 'Workspace name is required'),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

/* ── Helpers ── */

function slugify(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/* ── Types ── */

type OrgData = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	createdAt: Date;
};

/* ── Component ── */

const WorkspaceForm = () => {
	const [org, setOrg] = useState<OrgData | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	// Slug editing
	const [slugValue, setSlugValue] = useState('');
	const [slugEditing, setSlugEditing] = useState(false);
	const [slugValid, setSlugValid] = useState<boolean | null>(null);
	const [slugChecking, setSlugChecking] = useState(false);

	const fetchOrg = useCallback(async () => {
		try {
			const { data } = await authClient.organization.getFullOrganization();
			if (data) {
				const orgData = data as unknown as { id: string; name: string; slug: string; logo: string | null; createdAt: Date };
				setOrg(orgData);
				setSlugValue(orgData.slug);
			}
		} catch {
			toast.error('Failed to load workspace details.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrg();
	}, [fetchOrg]);

	// Slug availability check
	useEffect(() => {
		if (!slugEditing || !slugValue || slugValue === org?.slug) {
			setSlugValid(null);
			setSlugChecking(false);
			return;
		}

		setSlugChecking(true);
		const timeout = setTimeout(async () => {
			try {
				const res = await authClient.organization.checkSlug({
					slug: slugValue,
				});
				setSlugValid((res.data as any)?.status || false);
			} catch {
				setSlugValid(false);
			} finally {
				setSlugChecking(false);
			}
		}, 600);

		return () => clearTimeout(timeout);
	}, [slugValue, slugEditing, org?.slug]);

	const form = useForm<WorkspaceFormValues>({
		resolver: zodResolver(workspaceSchema),
		values: {
			name: org?.name ?? '',
		},
		mode: 'onTouched',
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = form;

	const hasSlugChanged = slugEditing && slugValue !== org?.slug;
	const hasChanges = isDirty || hasSlugChanged;

	const onSubmit = async (values: WorkspaceFormValues) => {
		if (hasSlugChanged && slugValid !== true) {
			toast.error('Please choose an available workspace URL.');
			return;
		}

		setIsSaving(true);
		try {
			const updatePayload: { name?: string; slug?: string } = {};

			if (values.name !== org?.name) {
				updatePayload.name = values.name;
			}
			if (hasSlugChanged) {
				updatePayload.slug = slugValue;
			}

			if (Object.keys(updatePayload).length === 0) {
				toast.info('No changes to save.');
				setIsSaving(false);
				return;
			}

			const { error } = await authClient.organization.update({
				data: updatePayload,
			});

			if (error) {
				toast.error(error.message || 'Failed to update workspace.');
			} else {
				toast.success('Workspace updated successfully!');
				await fetchOrg();
				form.reset(values);
				setSlugEditing(false);
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) {
		return <WorkspaceFormSkeleton />;
	}

	if (!org) {
		return (
			<div className="rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm">
				<p className="text-sm text-muted-foreground">
					No workspace found. Create one from the onboarding flow.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Workspace name */}
			<Field data-invalid={!!errors.name}>
				<FieldLabel htmlFor="workspace-name">Workspace Name</FieldLabel>
				<div className="relative">
					<Input
						id="workspace-name"
						placeholder="My Company"
						className="peer h-10 bg-background pl-9"
						aria-invalid={!!errors.name}
						{...register('name')}
					/>
					<IconBuilding className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
				</div>
				{errors.name && <FieldError errors={[errors.name]} />}
			</Field>

			{/* Workspace slug/URL */}
			<Field>
				<FieldLabel htmlFor="workspace-slug">Workspace URL</FieldLabel>
				<div
					className={cn(
						'flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
						slugEditing
							? 'border-primary/30 bg-primary/5 focus-within:border-primary/50'
							: 'border-border/50 bg-muted/30',
					)}
				>
					<IconWorld className="size-4 shrink-0 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						stepwize.app/
					</span>
					<input
						id="workspace-slug"
						type="text"
						value={slugValue}
						onChange={(e) => {
							setSlugEditing(true);
							setSlugValue(slugify(e.target.value));
						}}
						className="w-full bg-transparent p-0 text-sm font-semibold text-primary focus:outline-none"
						placeholder="my-workspace"
					/>
					<div className="flex shrink-0 items-center gap-1.5">
						{slugChecking ? (
							<IconLoader2 className="size-4 animate-spin text-muted-foreground" />
						) : slugValid === true ? (
							<IconCheck className="size-4 text-emerald-500" />
						) : slugValid === false ? (
							<IconAlertCircle className="size-4 text-destructive" />
						) : null}
					</div>
				</div>
				{slugValid === false && (
					<p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
						<IconAlertCircle className="size-3.5 shrink-0" />
						This URL is not available. Please choose another.
					</p>
				)}
				<FieldDescription>
					Your workspace URL is how members access your team. Changing it
					will break existing bookmarks.
				</FieldDescription>
			</Field>

			{/* Workspace ID (read-only) */}
			<Field>
				<FieldLabel htmlFor="workspace-id">Workspace ID</FieldLabel>
				<Input
					id="workspace-id"
					value={org.id}
					className="h-10 bg-muted/30 font-mono text-xs opacity-70"
					disabled
				/>
				<FieldDescription>
					Unique identifier for API integrations. This cannot be changed.
				</FieldDescription>
			</Field>

			{/* Save button */}
			<div className="flex items-center justify-end gap-3 pt-2">
				<Button
					type="button"
					variant="ghost"
					disabled={!hasChanges || isSaving}
					onClick={() => {
						form.reset();
						setSlugValue(org.slug);
						setSlugEditing(false);
						setSlugValid(null);
					}}
					className="text-muted-foreground"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={!hasChanges || isSaving || (hasSlugChanged && slugValid !== true)}
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

const WorkspaceFormSkeleton = () => (
	<div className="space-y-6">
		<div className="space-y-2">
			<Skeleton className="h-4 w-28" />
			<Skeleton className="h-10 w-full rounded-lg" />
		</div>
		<div className="space-y-2">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-10 w-full rounded-lg" />
		</div>
		<div className="space-y-2">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-10 w-full rounded-lg" />
		</div>
	</div>
);

export default WorkspaceForm;
