import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';

interface ExperienceItem {
  id?: number;
  company: string;
  role: string;
  type: string;
  location: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  description: string | string[];
  skills: string | string[];
}

const defaultExperiences: ExperienceItem[] = [
  {
    company: 'Capsule Labs',
    role: 'Data Engineer',
    type: 'Full-time',
    location: 'Kolkata, West Bengal, India',
    duration: 'Jul 2025 - Present (8 mos)',
    description: [
      'Working on data pipeline development and optimization',
      'Implementing automation solutions for ML workflows',
      'Managing data extraction and ingestion processes'
    ],
    skills: ['Selenium', 'Python', 'PostgreSQL', 'n8n', 'Data Analysis']
  },
  {
    company: 'Capsule Labs',
    role: 'Software Engineer',
    type: 'Internship',
    location: 'Kolkata, West Bengal, India',
    duration: 'Sep 2024 - Jul 2025 (11 mos)',
    description: [
      'Developed and optimized Python-based automation scripts for core data processing tasks',
      'Spearheaded end-to-end data preparation for ML models',
      'Successfully executed data extraction and data ingestion across various source systems',
      'Contributed to qualitative research projects by leading aggregation of complex information'
    ],
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Automation', 'Research']
  }
];

function ExperienceCard({ experience, index }: { experience: ExperienceItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const descriptionArray = Array.isArray(experience.description) 
    ? experience.description 
    : experience.description?.split('\n').filter(Boolean) || [];
  
  const skillsArray = Array.isArray(experience.skills) 
    ? experience.skills 
    : JSON.parse(experience.skills || '[]');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className="glass rounded-2xl p-6 md:p-8 card-hover">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{experience.role}</h3>
                <p className="text-violet-500 font-medium">{experience.company}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
              <Briefcase className="w-3 h-3" />
              {experience.type}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
              <MapPin className="w-3 h-3" />
              {experience.location}
            </span>
          </div>
        </div>

        {/* Duration */}
        {experience.duration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>{experience.duration}</span>
          </div>
        )}

        {/* Description */}
        {descriptionArray.length > 0 && (
          <ul className="space-y-2 mb-6">
            {descriptionArray.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.2 + i * 0.1 }}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-500 border border-violet-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Timeline connector */}
      {index < (defaultExperiences.length - 1) && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
          className="absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-violet-500 to-transparent origin-top"
        />
      )}
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences);

  useEffect(() => {
    fetchAndMergeExperience();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAndMergeExperience();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const refreshInterval = setInterval(fetchAndMergeExperience, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchAndMergeExperience = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/experience`);
      if (response.ok) {
        const dbExperience = await response.json();
        // Combine default with database records
        const merged = [...defaultExperiences, ...dbExperience];
        setExperiences(merged);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    }
  };

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
          >
            <Briefcase className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-500 font-medium">Career</span>
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional journey in data engineering and software development, 
            building scalable solutions and automation systems.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <ExperienceCard key={`${exp.company}-${exp.role}`} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
