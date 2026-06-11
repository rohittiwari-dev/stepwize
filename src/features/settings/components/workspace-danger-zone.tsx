'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconAlertTriangle, IconLoader2, IconTrash } from '@tabler/icons-react';
import { authClient } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WorkspaceDangerZone = () => {
	const router = useRouter();
	const [confirmText, setConfirmText] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [orgId, setOrgId] = useState<string | null>(null);

	useEffect(() => {
		authClient.organization
			.getFullOrganization()
			.then(({ data }) => {
				if (data) {
					setOrgId((data as unknown as { id: string }).id);
				}
			})
			.catch(() => {});
	}, []);

	const canDelete = confirmText === 'DELETE' && !!orgId;

	const handleDelete = async () => {
		if (!canDelete) {
			return;
		}

		setIsDeleting(true);
		try {
			const { error } = await authClient.organization.delete({
				organizationId: orgId,
			});
			if (error) {
				toast.error(error.message || 'Failed to delete workspace.');
			} else {
				toast.success('Workspace deleted.');
				router.push('/get-started');
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5 backdrop-blur-sm">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10">
					<IconAlertTriangle className="size-4 text-destructive" />
				</div>
				<div className="flex-1 space-y-3">
					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Delete Workspace
						</h3>
						<p className="text-xs text-muted-foreground">
							Permanently delete this workspace and all of its data,
							including workflows, credentials, and member access. This
							action is irreversible.
						</p>
					</div>

					{showConfirm ? (
						<div className="space-y-3">
							<div className="space-y-1.5">
								<p className="text-xs font-medium text-destructive">
									Type <span className="font-bold">DELETE</span> to
									confirm
								</p>
								<Input
									value={confirmText}
									onChange={(e) =>
										setConfirmText(e.target.value)
									}
									placeholder="DELETE"
									className="h-9 border-destructive/30 font-mono text-sm focus-visible:border-destructive focus-visible:ring-destructive/30"
									autoFocus
								/>
							</div>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => {
										setShowConfirm(false);
										setConfirmText('');
									}}
									className="text-muted-foreground"
								>
									Cancel
								</Button>
								<Button
									type="button"
									variant="destructive"
									size="sm"
									disabled={!canDelete || isDeleting}
									onClick={handleDelete}
								>
									{isDeleting ? (
										<IconLoader2 className="size-3.5 animate-spin" />
									) : (
										<>
											<IconTrash className="size-3.5" />
											<span>Delete forever</span>
										</>
									)}
								</Button>
							</div>
						</div>
					) : (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={() => setShowConfirm(true)}
						>
							<IconTrash className="size-3.5" />
							<span>Delete workspace</span>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkspaceDangerZone;
