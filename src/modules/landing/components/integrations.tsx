'use client';

import { motion } from 'motion/react';
import { EASE } from './reveal';
import ChromaGrid from '@/components/ui/chroma-grid';

const integrationsData = [
	{
		title: 'Slack',
		subtitle: 'Team Notifications',
		image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=300&q=80',
		borderColor: '#4F46E5',
		gradient: 'linear-gradient(145deg, #4F46E5, #1a1625)',
	},
	{
		title: 'GitHub',
		subtitle: 'Source Control',
		image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=300&q=80',
		borderColor: '#8B5CF6',
		gradient: 'linear-gradient(210deg, #8B5CF6, #1a1625)',
	},
	{
		title: 'Stripe',
		subtitle: 'Payments',
		image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=300&q=80',
		borderColor: '#06B6D4',
		gradient: 'linear-gradient(165deg, #06B6D4, #1a1625)',
	},
	{
		title: 'AWS',
		subtitle: 'Cloud Infrastructure',
		image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
		borderColor: '#F59E0B',
		gradient: 'linear-gradient(195deg, #F59E0B, #1a1625)',
	},
	{
		title: 'Salesforce',
		subtitle: 'CRM',
		image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
		borderColor: '#10B981',
		gradient: 'linear-gradient(225deg, #10B981, #1a1625)',
	},
	{
		title: 'Twilio',
		subtitle: 'Communications',
		image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80',
		borderColor: '#EF4444',
		gradient: 'linear-gradient(135deg, #EF4444, #1a1625)',
	}
];

export const LandingIntegrations = () => {
	return (
		<section id="integrations" className="relative py-24 sm:py-32 overflow-hidden bg-background">
			<div className="mx-auto max-w-6xl px-6 sm:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: EASE }}
					className="mx-auto max-w-2xl text-center mb-16"
				>
					<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
						Connects to everything.
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Stepwize seamlessly integrates with all your favorite tools out of the box. Drag and drop connections to APIs, databases, and communication channels.
					</p>
				</motion.div>

				<div className="relative h-[600px] w-full max-w-[1000px] mx-auto mt-8">
					<ChromaGrid 
						items={integrationsData}
						radius={300}
						className="scale-90 md:scale-100"
					/>
				</div>
			</div>
		</section>
	);
};
