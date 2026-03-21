import React from "react";
import { motion } from "motion/react";
import { Info, Target, Users, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-8 text-slate-900"
      >
        About <span className="text-emerald-500">Slasham</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-600 mb-12 leading-relaxed"
      >
        Slasham is dedicated to bridging the gap between premium local businesses and savvy consumers. We believe in creating value, fostering community, and making premium experiences accessible to everyone. Our platform is built on the foundation of trust, transparency, and a deep understanding of the local market dynamics. We strive to empower businesses to reach their full potential while ensuring that consumers get the best possible value for their money.
      </motion.p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {[
          { title: "Our Mission", desc: "To empower local businesses with digital tools while providing consumers with unbeatable deals. We aim to digitize the local economy and create a seamless bridge between service providers and their customers.", icon: <Target className="text-emerald-500" /> },
          { title: "Our Vision", desc: "To become the leading platform for premium local experiences across Africa. We envision a future where every local business, regardless of size, can leverage technology to thrive and every consumer can easily discover and enjoy the best their city has to offer.", icon: <Award className="text-amber-500" /> },
          { title: "Our Team", desc: "A passionate group of innovators, marketers, and tech enthusiasts. Our team is composed of industry experts from diverse backgrounds, all united by a shared commitment to excellence and a passion for building solutions that make a real difference in people's lives.", icon: <Users className="text-blue-500" /> },
          { title: "Our Values", desc: "Integrity, innovation, community, and excellence in everything we do. We believe that these core values are the bedrock of our success and guide every decision we make, from the features we build to the partners we choose to work with.", icon: <Info className="text-purple-500" /> }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 p-12 bg-slate-900 rounded-[3rem] text-white">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-slate-400 leading-relaxed mb-6">
          Slasham started in a small apartment in Abuja with a simple idea: local businesses have so much to offer, but often struggle to reach the right audience. We wanted to create a platform that would not only help these businesses grow but also make premium experiences more accessible to everyone.
        </p>
        <p className="text-slate-400 leading-relaxed">
          What began as a small project to help a few local restaurants has grown into a comprehensive platform serving thousands of users and hundreds of businesses across multiple cities. Our journey has been defined by constant learning, innovation, and a relentless focus on our users' needs. We've faced challenges, celebrated milestones, and remained steadfast in our commitment to building a platform that truly adds value to the local ecosystem. Today, we are proud to be a part of the vibrant local economy, connecting thousands of consumers with the best deals in their city, and we're just getting started.
        </p>
      </div>
    </div>
  );
}
