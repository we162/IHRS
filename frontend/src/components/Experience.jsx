import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { ArrowRight } from 'lucide-react';

const experiences = [
  {
    title: "Beginner Training",
    description: "Start your journey in a safe environment with calm horses and expert coaches.",
    image: "/beginner.jpg"
  },
  {
    title: "Professional Training",
    description: "Refine your competitive edge with advanced techniques and professional guidance.",
    image: "/professional.jpg"
  },
  {
    title: "Weekend Riding",
    description: "Relaxing trail rides through scenic landscapes, perfect for unwinding on weekends.",
    image: "/weekend.jpg"
  },
  {
    title: "Private Coaching",
    description: "1-on-1 personalized sessions to accelerate your riding goals and confidence.",
    image: "/private.jpg"
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 bg-dark relative">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionTitle title="Our Services" subtitle="Riding Experience" centered />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-primary group rounded-xl overflow-hidden border border-light-gray hover:border-accent hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 relative z-20">
                <h3 className="text-xl font-heading text-white mb-3 group-hover:text-accent transition-colors">
                  {exp.title}
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  {exp.description}
                </p>
                <a href="#booking" className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                  Book Slot
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
