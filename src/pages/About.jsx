// Importing React for building the component
import React from 'react';

// Importing the background image for the About section
import HomepageBG from '../assets/HomepageBG.webp';

// Importing icons from lucide-react for visual enhancements
import {
  Leaf,
  ShieldCheck,
  Recycle,
  BadgeCheck,
  Heart,
  Sparkles,
  PiggyBank,
} from 'lucide-react';

// 🔹 Reusable Badge component for highlighting short info with an icon
const Badge = ({ icon, text }) => (
  <span 
    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm md:text-base inline-flex items-center gap-2"
  >
    {icon} {/* The passed icon (e.g., Recycle, Sparkles) */}
    {text} {/* The label text */}
  </span>
);

// 🔹 Reusable Card component for sections like "What We Do", "Mission", "Impact"
const Card = ({ title, text }) => (
  <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/15 shadow-xl">
    <h3 className="text-xl font-semibold mb-3">{title}</h3> {/* Card heading */}
    <p className="text-gray-200 leading-relaxed">{text}</p> {/* Card content */}
  </div>
);

// 🔹 Reusable Feature component for displaying key features
const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
    {/* Icon container */}
    <div className="shrink-0 p-2 rounded-lg bg-white/10">{icon}</div>
    {/* Title + Description */}
    <div>
      <p className="font-semibold text-white">{title}</p> {/* Feature title */}
      <p className="text-sm text-gray-200">{desc}</p> {/* Feature description */}
    </div>
  </div>
);

// 🔹 Main About component
const About = () => (
  <section className="relative py-20 lg:py-28 overflow-hidden min-h-screen">
    {/* 🔸 Background section with image and overlays */}
    <div className="absolute inset-0">
      {/* Background image covering entire section */}
      <img
        src={HomepageBG}
        alt="About Us Background"
        className="w-full h-full object-cover md:fixed md:top-0 md:left-0 z-[-1]"
      />
      {/* Black overlay for darkening background */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Decorative radial yellow gradient overlay */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(800px_400px_at_50%_0%,rgba(250,204,21,0.15),transparent_70%)]" />
    </div>

    {/* 🔸 Content section */}
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      
      {/* 🔹 Hero section (main heading + tagline) */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          About{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            RECycle Marketplace
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
          A student-led sustainability initiative by Taskforce NIT Trichy,
          making campus mobility affordable and eco-friendly.
        </p>

        {/* 🔹 Badges row (quick highlights) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Badge
            icon={<Recycle size={16} className="text-yellow-400" />}
            text="100+ cycles refurbished yearly"
          />
          <Badge
            icon={<Sparkles size={16} className="text-yellow-400" />}
            text="10+ years of impact"
          />
          <Badge
            icon={<Heart size={16} className="text-yellow-400" />}
            text="Trusted by hundreds yearly"
          />
        </div>
      </div>

      {/* 🔹 Cards: What We Do, Mission, Impact */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="What We Do"
          text="We refurbish pre-owned bicycles and offer student-friendly rentals for first-years, giving unused cycles a second life and reducing campus waste."
        />
        <Card
          title="Our Mission"
          text="To make mobility on campus eco-friendly, affordable, and accessible for every student while nurturing a culture of sustainability."
        />
        <Card
          title="Impact"
          text="With strong admin support and an enthusiastic student team, RECycle continues to scale responsibly and serve newcomers each year."
        />
      </div>

      {/* 🔹 Features grid */}
      <div className="mt-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Why Choose Us?
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature items */}
          <Feature
            icon={<PiggyBank className="text-yellow-400" size={20} />}
            title="Student-friendly Pricing"
            desc="Affordable rentals designed for first-years."
          />
          <Feature
            icon={<Leaf className="text-yellow-400" size={20} />}
            title="Eco-friendly"
            desc="Refurbishing extends lifecycle and reduces waste."
          />
          <Feature
            icon={<ShieldCheck className="text-yellow-400" size={20} />}
            title="Reliable Rides"
            desc="Well-maintained cycles ready for daily use."
          />
          <Feature
            icon={<BadgeCheck className="text-yellow-400" size={20} />}
            title="Transparent Process"
            desc="Clear holds, rentals, and pickup flow."
          />
          <Feature
            icon={<Recycle className="text-yellow-400" size={20} />}
            title="Sustainable Choice"
            desc="Join a campus-wide circular movement."
          />
          <Feature
            icon={<Heart className="text-yellow-400" size={20} />}
            title="Community-run"
            desc="Student-led with administrative support."
          />
        </div>
      </div>

      {/* 🔹 Closing line at the bottom */}
      <p className="mt-10 text-center text-gray-300">
        One cycle at a time, we're working together to create a smarter, greener
        campus.
      </p>
    </div>
  </section>
);

// Exporting About component so it can be used in other parts of the app
export default About;
