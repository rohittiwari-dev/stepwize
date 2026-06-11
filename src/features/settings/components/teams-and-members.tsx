'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
	IconUser,
	IconLoader2,
	IconTrash,
	IconMail,
	IconShield,
	IconPlus,
	IconUsers,
	IconCheck,
	IconX,
} from '@tabler/icons-react';
import { authClient } from '@/lib/auth/clients';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const TeamsAndMembers = () => {
	const { data: session } = authClient.useSession();
	const { data: activeOrg, isPending: orgPending } = authClient.useActiveOrganization();
	
	const [fullOrg, setFullOrg] = useState<any>(null);
	const [loadingFullOrg, setLoadingFullOrg] = useState(true);

	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteTeamId, setInviteTeamId] = useState('');
	const [isInviting, setIsInviting] = useState(false);

	const [newTeamName, setNewTeamName] = useState('');
	const [isCreatingTeam, setIsCreatingTeam] = useState(false);

	const fetchFullOrg = useCallback(async () => {
		try {
			const { data } = await authClient.organization.getFullOrganization();
			if (data) {
				setFullOrg(data);
			}
		} catch {
			toast.error('Failed to load full organization data.');
		} finally {
			setLoadingFullOrg(false);
		}
	}, []);

	useEffect(() => {
		if (activeOrg?.id) {
			fetchFullOrg();
		} else if (activeOrg === null) {
			setLoadingFullOrg(false);
		}
	}, [activeOrg?.id, fetchFullOrg]);

	const loading = orgPending || loadingFullOrg;

	if (loading) {
		return <LoadingSkeleton />;
	}

	if (!activeOrg || !fullOrg) {
		return (
			<div className="rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm">
				<p className="text-sm text-muted-foreground">
					No active workspace found.
				</p>
			</div>
		);
	}

	const members = fullOrg.members || [];
	const invitations = fullOrg.invitations || [];
	// Teams may be inside fullOrg.teams
	const teams = fullOrg.teams || [];

    // Identify current user and permissions
    const currentUserMember = members.find((m: any) => m.userId === session?.user?.id);
    const currentUserRole = currentUserMember?.role || 'member';
    const isOwner = currentUserRole === 'owner';
    const isAdmin = currentUserRole === 'admin';
    const isPrivileged = isOwner || isAdmin;

    // Find the default team (usually the oldest one or the one matching org name)
    const sortedTeams = [...teams].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const defaultTeamId = sortedTeams[0]?.id;

	const handleInvite = async () => {
		if (!inviteEmail.trim() || !inviteTeamId) {
            toast.error('Please enter an email and select a team.');
            return;
        }

		setIsInviting(true);
		try {
			const { error } = await authClient.organization.inviteMember({
				email: inviteEmail.trim(),
				role: 'member',
				teamId: inviteTeamId,
			} as any);

			if (error) {
				toast.error(error.message || 'Failed to send invite.');
			} else {
				toast.success('Invitation sent!');
				setInviteEmail('');
				await fetchFullOrg();
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		} finally {
			setIsInviting(false);
		}
	};

	const handleRemoveMember = async (memberIdOrEmail: string) => {
		try {
			const { error } = await authClient.organization.removeMember({
				memberIdOrEmail,
			});
			if (error) {
				toast.error(error.message || 'Failed to remove member.');
			} else {
				toast.success('Member removed.');
				await fetchFullOrg();
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		}
	};

	const handleCancelInvite = async (invitationId: string) => {
		try {
			const { error } = await authClient.organization.cancelInvitation({
				invitationId,
			});
			if (error) {
				toast.error(error.message || 'Failed to cancel invitation.');
			} else {
				toast.success('Invitation canceled.');
				await fetchFullOrg();
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		}
	};

	const handleCreateTeam = async () => {
		if (!newTeamName.trim()) return;

		setIsCreatingTeam(true);
		try {
			const { error } = await (authClient.organization as any).createTeam({
				name: newTeamName.trim(),
				organizationId: activeOrg.id,
			});
			if (error) {
				toast.error(error.message || 'Failed to create team.');
			} else {
				toast.success('Team created!');
				setNewTeamName('');
				await fetchFullOrg();
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		} finally {
			setIsCreatingTeam(false);
		}
	};

	const handleDeleteTeam = async (teamId: string) => {
		try {
			const { error } = await (authClient.organization as any).deleteTeam({
				teamId,
			});
			if (error) {
				toast.error(error.message || 'Failed to delete team.');
			} else {
				toast.success('Team deleted.');
				await fetchFullOrg();
			}
		} catch (err: any) {
			toast.error(err.message || 'An unexpected error occurred.');
		}
	};

	return (
		<div className="space-y-10">
			{/* Members Section */}
			<section className="space-y-5">
				<div>
					<h2 className="text-sm font-semibold text-foreground/90">
						Workspace Members
					</h2>
					<p className="text-xs text-muted-foreground">
						Invite colleagues directly to a team
					</p>
				</div>

				{/* Invite Section (Only for privileged users) */}
				{isPrivileged && (
					<div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
						<div className="flex-1">
							<div className="relative">
								<Input
									placeholder="colleague@company.com"
									value={inviteEmail}
									onChange={(e) => setInviteEmail(e.target.value)}
									className="h-10 pl-9"
								/>
								<IconMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>
						</div>
                        {teams.length > 0 && (
                            <div className="w-48">
                                <Select value={inviteTeamId} onValueChange={(val) => setInviteTeamId(val || '')}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select Team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((t: any) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
						<Button
							onClick={handleInvite}
							disabled={!inviteEmail.trim() || !inviteTeamId || isInviting}
							className="h-10 min-w-[100px] shadow-neon"
						>
							{isInviting ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								<>
									<IconPlus className="size-4" />
									Invite
								</>
							)}
						</Button>
					</div>
				)}

				{/* Members List */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold text-foreground">
						Members ({members.length})
					</h3>
					<div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
						<div className="divide-y divide-border/50">
							{members.map((member: any) => (
								<div
									key={member.id}
									className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
								>
									<div className="flex items-center gap-3">
										<Avatar className="size-10 rounded-lg border">
											<AvatarImage
												src={member.user?.image}
												alt={member.user?.name}
											/>
											<AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
												{member.user?.name
													?.substring(0, 2)
													.toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center gap-2">
												<p className="text-sm font-medium text-foreground">
													{member.user?.name ||
														'Unknown'}
												</p>
												{member.role === 'owner' && (
													<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
														<IconShield className="size-3" />
														Owner
													</span>
												)}
                                                {member.role === 'admin' && (
													<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
														<IconShield className="size-3" />
														Admin
													</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{member.user?.email}
											</p>
										</div>
									</div>
									{isPrivileged && member.role !== 'owner' && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleRemoveMember(member.user?.email || member.id)
											}
											className="text-muted-foreground hover:text-destructive"
										>
											<IconTrash className="size-4" />
										</Button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Invitations List */}
				{invitations.length > 0 && (
					<div className="space-y-3 pt-4">
						<h3 className="text-sm font-semibold text-foreground">
							Pending Invitations ({invitations.length})
						</h3>
						<div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
							<div className="divide-y divide-border/50">
								{invitations.map((inv: any) => (
									<div
										key={inv.id}
										className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
									>
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
												<IconMail className="size-4 text-muted-foreground" />
											</div>
											<div>
												<p className="text-sm font-medium text-foreground">
													{inv.email}
												</p>
												<div className="flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        Role: {inv.role}
                                                    </p>
                                                    {inv.teamId && (
                                                        <p className="text-xs text-muted-foreground">
                                                            • Team: {teams.find((t: any) => t.id === inv.teamId)?.name || 'Unknown'}
                                                        </p>
                                                    )}
                                                </div>
											</div>
										</div>
										{isPrivileged && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleCancelInvite(inv.id)
                                                }
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                Cancel
                                            </Button>
                                        )}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</section>

			{/* Teams Section */}
			<section className="space-y-5">
				<div>
					<h2 className="text-sm font-semibold text-foreground/90">
						Teams
					</h2>
					<p className="text-xs text-muted-foreground">
						Organize members into groups for access control
					</p>
				</div>

				{/* Create Team Section (Only for Owners) */}
				{isOwner && (
					<div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
						<div className="flex-1">
							<div className="relative">
								<Input
									placeholder="e.g. Engineering, Marketing..."
									value={newTeamName}
									onChange={(e) => setNewTeamName(e.target.value)}
									onKeyDown={(e) =>
										e.key === 'Enter' && handleCreateTeam()
									}
									className="h-10 pl-9"
								/>
								<IconUsers className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>
						</div>
						<Button
							onClick={handleCreateTeam}
							disabled={!newTeamName.trim() || isCreatingTeam}
							className="h-10 min-w-[120px] shadow-neon"
						>
							{isCreatingTeam ? (
								<IconLoader2 className="size-4 animate-spin" />
							) : (
								<>
									<IconPlus className="size-4" />
									Create Team
								</>
							)}
						</Button>
					</div>
				)}

				{/* Teams List */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold text-foreground">
						Teams ({teams.length})
					</h3>
					<div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
						{teams.length === 0 ? (
							<div className="p-6 text-center">
								<p className="text-sm text-muted-foreground">
									No teams created yet.
								</p>
							</div>
						) : (
							<div className="divide-y divide-border/50">
								{sortedTeams.map((team: any) => {
                                    const isDefault = team.id === defaultTeamId;
                                    return (
									<div
										key={team.id}
										className="flex items-center justify-between p-4 transition-colors hover:bg-muted/20"
									>
										<div className="flex items-center gap-3">
											<div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
												<IconUsers className="size-4 text-muted-foreground" />
											</div>
											<div>
												<div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {team.name}
                                                    </p>
                                                    {isDefault && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                            <IconShield className="size-3" />
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
												<p className="text-xs text-muted-foreground">
													Created on{' '}
													{new Date(
														team.createdAt,
													).toLocaleDateString()}
												</p>
											</div>
										</div>
										{isOwner && !isDefault && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDeleteTeam(team.id)}
												className="text-muted-foreground hover:text-destructive"
											>
												<IconTrash className="size-4" />
											</Button>
										)}
									</div>
								)})}
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

const LoadingSkeleton = () => (
	<div className="space-y-10">
		<section className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-[74px] w-full rounded-xl" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="rounded-xl border border-border/50 bg-card/50 h-32">
                </div>
            </div>
        </section>
        <section className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-[74px] w-full rounded-xl" />
            <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="rounded-xl border border-border/50 bg-card/50 h-32">
                </div>
            </div>
        </section>
	</div>
);
